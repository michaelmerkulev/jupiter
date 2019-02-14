// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  logging: true,
  api_endpoint: 'http://1-dot-taxi2deal.appspot.com/app',
  firebase: {
    apiKey: "AIzaSyDEVZtAeI8aqQhnVIOgTWCe8hX7SjfN5hw",
    authDomain: "taxi-deals-swiss-afc07.firebaseapp.com",
    databaseURL: "https://taxi-deals-swiss-afc07.firebaseio.com",
    projectId: "taxi-deals-swiss-afc07",
    storageBucket: "taxi-deals-swiss-afc07.appspot.com",
    messagingSenderId: "298032037028"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
