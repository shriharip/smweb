import * as functions from 'firebase-functions';
import { stripe, db, stripeClientId } from './config';
import { createCustomer } from './helpers';

export const createStripeCustomer = (userId) => {

        const userRef = db.collection('users').doc(userId);
        
        return createCustomer(userRef)

            .then(customer => {
                
                /// update Firestore with stripe customer id
                const data = { stripeCustomerId: customer.id }
                return userRef.set(data, { merge: true });
            })
            .catch(console.log)
    };




