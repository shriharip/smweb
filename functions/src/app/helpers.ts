import { stripe, db, auth } from './config';
import * as rp from 'request-promise';

/////  USER MANAGEMENT ///////

// Authenticates Firebase user on HTTP functions, used as expressJS middleware
export function authenticateUser(req, res, next): void {
    
    let authToken;

    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ) {
        authToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        res.status(403).send('Must provide a header that looks like "Authorization: Bearer <Firebase ID Token>"');
    }

    auth.verifyIdToken(authToken)
        .then(decodedToken => { 
            req.user = decodedToken;
            next();
        })
        .catch(err => res.status(403).send(err))
}

// Returns the user document data from Firestore
export async function getUser(userId: string,  companyData: any ): Promise<any> {
    return await db.collection('company').doc(companyData.UID).collection('users').doc(userId).get().then(doc => doc.data());
}

export async function getComp(companyData: any ): Promise<any> {
    return await db.collection('company').doc(companyData.UID).get().then(doc => doc.data());
}
// Takes a Firebase user and creates a Stripe customer account
export async function createCustomer(userId: string, companyData: any): Promise<any> {

    const userData = await getUser(userId, companyData);
    const compRef = db.collection('company').doc(companyData.UID);

    if(!companyData.stripeCustomerId) {
        try {
            let customer = await stripe.customers.create({
                email: userData.email,
                metadata: { firebaseUID: companyData.UID, name: companyData.name, tax_info: companyData.VAT }
            })
            
            if(customer) {
                const data = { stripeCustomerId: customer.id };
                  return compRef.set(data, { merge: true });
            }
        } catch (error) {
                return error;
        } 
    
} else{
  return await stripe.customers.update(companyData.stripeCustomerId , {
        email: userData.email,
        metadata: { firebaseUID: companyData.UID, name: companyData.name, tax_info: companyData.VAT }
    })
}
}


export async function getCustomer(userId: string, companyData: any): Promise<any> {
    
    const comp       = await getComp(companyData);
    const customerId = comp.stripeCustomerId;

    return await stripe.customers.retrieve(customerId);
}


/////  CHARGES and SOURCES ///////
    
// Looks for payment source attached to user, otherwise it creates it. 
export async function attachSource(userId: string, sourceId: string,  companyData: any): Promise<any> {

    const customer = await getCustomer(userId, companyData);

    const existingSource = customer.sources.data.filter(source => source.id === sourceId).pop() 

    if (existingSource) {
        return existingSource;
    } 
    else {
        try {
            let success =  await stripe.customers.createSource(customer.id, { source: sourceId });
            if(success) {
                const compRef = db.collection('company').doc(companyData.UID);
                const data = { stripeSourceId: sourceId };
                  return compRef.set(data, { merge: true });
            }
        } catch (error) {
                return error;
        }
        
    }
}


// Charges customer with supplied source and amount 
export async function createCharge(sourceId: string, amount: number, customerId:String, tripId:String, currency? :string, ): Promise<any> {

    // const user       = await getUser(userId, companyData);
    // const customerId = user.stripeCustomerId;

    // const card       = await attachSource(userId, sourceId, companyData)
    
    return await stripe.charges.create({
        amount: amount,
        currency: currency || 'EUR',
        customer: customerId,
        source: sourceId,
        description: tripId
    })
}


// Charges customer with customerId and amount 
export async function createCustCharge(desc: string, custId: string, amount: number, currency? :string): Promise<any> {
     
    return await stripe.charges.create({
        amount: amount,
        currency: currency || 'EUR',
        customer: custId, 
        description: desc
    })
}

/////  RETRIEVE DATA from STRIPE ///////

// Returns all charges associated with a user/customer
export async function getUserCharges(userId: string, companyData:any, limit?: number): Promise<any> {
    
    const user       = await getUser(userId, companyData);
    const customerId = user.stripeCustomerId;

    return await stripe.charges.list({ 
        limit, 
        customer: customerId 
    });
}

/////  SUBSCRIPTIONS ///////


// Creates a subscription
export async function createSubscription(userId:string, companyData:any, sourceId:string, planId: string): Promise<any> {

 
    const user       = await getUser(userId, companyData);
    const customerId = user.stripeCustomerId;

    const card       = await attachSource(userId, sourceId, companyData)

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
            {
              plan: planId,
            },
        ]
    });

    // Add the plan to existing subscriptions
    const subscriptions = { 
        [planId]: 'active'
    };

    await db.doc(`users/${userId}`).set({ subscriptions }, { merge: true });

    return subscription;
}

export async function orderTicket(userId: string, compId: string, amount: number, tripId: string, phoneNumber:string, ticketType:string): Promise<any> {
    console.log(compId, 'compId info')
    const compData =  await db.collection('company').doc(compId).get().then(doc => doc.data());

        console.log(compData.stripeSourceId, amount, compData.stripeCustomerId, tripId)
        const charge = await createCharge( compData.stripeSourceId, amount, compData.stripeCustomerId, tripId );
    
        if(charge) {
            console.log(charge, 'charge data')
            let options = {
                method: 'POST',
                uri: 'https://sales-api.hsl.fi/api/sandbox/ticket/v3/order',
                headers: {
                    'X-API-Key': 'bfcb0dbf-026f-4c32-9b00-e483f04a8682'
                },
                body: {
    
                        "phoneNumber": phoneNumber,
                        "ticketTypeId": "single",
                        "customerTypeId": "adult",
                        "regionId": "regional"
                      
                },
                json: true // Automatically stringifies the body to JSON
            };
    
            return await rp.post(options);
        }
        
    
    //console.log(userComp)
  
}

// Cancel/pause a subscription
export async function cancelSubscription(userId: string, planId: string, companyData: any): Promise<any> {

    const subscription   = await getSubscription(userId, planId, companyData);

    let cancellation; 

    // Possible cancellation already occured in Stripe
    if (subscription) {
        cancellation  = await stripe.subscriptions.del(subscription.id);
    }

    const subscriptions = { 
        [planId]: 'cancelled'
    };

    await db.doc(`users/${userId}`).set({ subscriptions }, { merge: true });

    return cancellation;

}

// recurringPayment is called by a Stripe webhook

export async function recurringPayment(customerId: string, planId: string, hook: string): Promise<any> {

    const customer = await stripe.customers.retrieve(customerId);
    const userId = customer.metadata.firebaseUID

    let status;

    // Payment succeeded
    if (hook === 'invoice.payment_succeeded') {
        status = 'active';
    };

    // Payment failed
    if (hook === 'invoice.payment_failed') {
        status = 'cancelled';
    };

    const subscriptions = { 
        [planId]: status
    };

    return await db.doc(`users/${userId}`).set({ subscriptions }, { merge: true });
}

export async function getCompanyFromUser(userId: string): Promise<any> {

    let user = await auth.getUser(userId);
    return await db.collection('users').where( 'email', '==', user.email).get();
 }

export async function getSubscription(userId: string, planId: string,  companyData: any): Promise<any> {
    const user       = await getUser(userId, companyData)
    const customer   = user.stripeCustomerId

    const stripeSubs     = await stripe.subscriptions.list({ customer, plan: planId })
    return stripeSubs.data[0]
}
