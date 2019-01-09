
import * as functions from 'firebase-functions';
import * as mailgunjs from 'mailgun-js';
import { gmailAccount , gmailPassword } from './config'
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

const api_key = 'b43b74c20c31576ee071056e7be0929e-49a2671e-8634ca9f';
const domain = 'sandbox3a687c84d2034141af9b66b7465ca36f.mailgun.org';
const mailgun = mailgunjs({apiKey: api_key, domain: domain});


// Sends an email confirmation when a user changes his mailing list subscription.
export const sendInvite = functions.firestore.document('/users/{uid}').onWrite(async (change, context) => {
 
    const document = change.after.exists ? change.after.data() : null;
    const link = 'https://simplemobility-2810.firebaseapp.com/register?' + "email=" + document.email + "&fullName=" + document.fullName + "&compId=" + document.compId ;
    if(document) {
        // Get an object with the previous document value (for update or delete)
      const oldDocument = change.before.data();

      if (document.send) {
        // Then return a promise of a set operation to update the count
        const data = {
            from: '"Simple Mobility." <noreply@simplemobility.io>',
            to: document.email,
                  
         // Building Email message.
            subject: 'Welcome, You have been invited to join Simple Mobility!',
            text: `Dear, ${ document.fullName},
             ${ document.company} is part of the Simple Mobility platform. Simple Mobility is a Mobility as a Service (MaaS)
            platform which leverage the public and private transport infrastructure to provide you with a seamless travel experience.

            Not only that your expenses are tracked and expense reports generated automatically. 
            Join now at ${link} .

            Best, 
            Team at Simple Mobility and ${ document.company} `
        }
    
        mailgun.messages().send(data, function (error, body) {
            console.log(body);
            console.log(error);
          });
  return null;
  } else{
       //there is no send request need to handle this part
    }
    }
});