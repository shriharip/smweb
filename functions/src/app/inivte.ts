
import * as functions from 'firebase-functions';
import { nodemailer } from 'nodemailer' 
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


// Sends an email confirmation when a user changes his mailing list subscription.
export const sendInvite = functions.firestore.document('/users/{uid}').onWrite((change, context) => {
 
    const document = change.after.exists ? change.after.data() : null;
    const link = 'https://app.simplemobility.io/signup/employee' + document.email;
    if(document) {
        // Get an object with the previous document value (for update or delete)
      const oldDocument = change.before.data();

      if (document.resend) {
        // Then return a promise of a set operation to update the count
        const mailOptions = {
            from: '"Simple Mobility." <noreply@simplemobility.io>',
            to: document.email,
                  
         // Building Email message.
            subject: 'Welcome, You have been invited to join Simple Mobility!',
            text: `Dear, ${ document.firstName},
             ${ document.company} is part of the Simple Mobility platform. Simple Mobility is a Mobility as a Service (MaaS)
            platform which leverage the public and private transport infrastructure to provide you with a seamless travel experience.

            Not only that your expenses are tracked and expense reports generated automatically. 
            Join now at ${link} .

            Best, 
            Team at Simple Mobility and ${ document.company} `
  }

  return mailTransport.sendMail(mailOptions)
    .then(() => console.log(`Invite link email sent to: document.email`))
    .catch((error) => console.error('There was an error while sending the email:', error));
      }

    } else{
        //todo Handle deletion
    }

});