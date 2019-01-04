// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig: {
    apiKey: "AIzaSyDlIj_HqSwXObsorXEHRg_7G52N2RJbZno",
    authDomain: "simplemobility-2810.firebaseapp.com",
    databaseURL: "https://simplemobility-2810.firebaseio.com",
    projectId: "simplemobility-2810",
    storageBucket: "simplemobility-2810.appspot.com",
    messagingSenderId: "722251902258"
  },
// http://localhost:5000
functionsURL: 'https://us-central1-simplemobility-2810.cloudfunctions.net/app',
// functionsURL: 'https://us-central1-stripe-elements.cloudfunctions.net',

stripePublishable: 'pk_test_L9Be7aZnAWo0ZWtY8SkT8MuI'


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
