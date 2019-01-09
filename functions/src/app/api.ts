import * as functions from 'firebase-functions';
import * as helpers from './helpers';
import { app } from './config';

// POST Charge
// app.post('/charges', (req, res) => {

//     const userId   = req.user.uid;
//     const sourceId = req.body.sourceId;
//     const amount   = req.body.amount;
//     const currency = req.body.currency;

//     const promise = helpers.createCharge(userId, sourceId, amount, currency)
//     defaultHandler(promise, res)
// });

// GET User Charges
// app.get('/charges', (req, res) => {
    
//     const userId   = req.user.uid;
//     const companyData  = req.body.companyRef;
//     const promise = helpers.getUserCharges(userId, companyData)
//     defaultHandler(promise, res)
// });


// POST sources
app.post('/sources', (req, res) => {
    
    const userId    = req.user.uid;
    const companyData  = req.body.companyRef;
    const sourceId  = req.body.sourceId;

    const promise = helpers.attachSource(userId, sourceId, companyData)
    defaultHandler(promise, res)
    
});

// GET customer (includes source and subscription data)
// app.get('/customer', (req, res) => {
    
//     const userId   = req.user.uid;
//     const companyData  = req.body.companyRef;
    
//     const promise = helpers.getCustomer(userId, companyData)
//     defaultHandler(promise, res)
    
// });

app.post('/customer', (req, res) => {
        
    const userId   = req.user.uid;
    const companyData  = req.body.companyRef;

    const promise  = helpers.createCustomer(userId, companyData);
 
    defaultHandler(promise, res)
    
});

// POST subscriptions (creates subscription on user account)
// app.post('/subscriptions', (req, res) => {
    
//     const userId   = req.user.uid;
//     const sourceId = req.body.sourceId;
//     const planId   = req.body.planId;
//     const companyData  = req.body.companyRef;
//     const promise = helpers.createSubscription(userId, sourceId, planId, companyData);

//     defaultHandler(promise, res)
// });

app.post('/order', (req, res) => {
    
    const userId   = req.user.uid; 
    const ticketType   = req.body.ticketType;
    const tripId = req.body.tripId;
    const phoneNumber  = req.body.phoneNumber;
    const amount = req.body.amount;
    const compId = req.body.compId;

    const promise = helpers.orderTicket(userId, compId, amount, tripId, phoneNumber, ticketType);

    defaultHandler(promise, res)
});

// PUT subscriptions (cancels subscription)
// app.put('/subscriptions/cancel', (req, res) => {
    
//     const userId   = req.user.uid;
//     const planId   = req.body.planId;
//     const companyData  = req.body.companyRef;
//     const promise = helpers.cancelSubscription(userId, planId, companyData);

//     defaultHandler(promise, res)
// });


// Default handling of response
function defaultHandler(promise: Promise<any>, res: any): void {
    promise
        .then(data => res.status(200).send(data) )
        .catch(err => res.status(400).send(err) )
}
    
export const api = functions.https.onRequest(app);