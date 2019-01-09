import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { User } from '../core/user';

interface Account {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}


@Injectable()
export class AuthService {

  user: Observable<User>;
  account$: Observable<Account>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

 this.account$ = this.afAuth.authState;
      //// Get auth data, then get firestore user document || null
      // using company name for display name as displayName will not be enabled on UI and we can use that to create a unique company id
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
         if (user && user.displayName) {
          return this.afs.doc<User>(`company/${user.displayName}/users/${user.uid}`).valueChanges()
          } else {
            return of(null)
          }
        })
      )
  }

  // googleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   return this.oAuthLogin(provider);
  // }

  // private oAuthLogin(provider) {
  //   return this.afAuth.auth.signInWithPopup(provider)
  //     .then(credential => {
  //       this.updateUserData(credential.user)
  //     })
  // }

  // anonymousLogin() {
  //   return this.afAuth.auth.signInAnonymously()
  //   .then(user => {
  //     this.updateUserData(user)
  //   })
  // }

  register(email, password, fullName, company) {

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(
        (afUser: firebase.auth.UserCredential) => {
          // Update the profile in firebase auth
         let compId = company.charCodeAt(0) + company.charCodeAt(1) + afUser.user.uid;
          afUser.user.updateProfile({
            displayName: compId,
            photoURL: ""
          });
          // Create the user in firestore
          this.user['uid'] = afUser.user.uid;
          this.user['displayName'] = fullName;
          this.user['company'] = company;
          this.user['email'] = afUser.user.email;
          this.user['photoURL'] = afUser.user.photoURL;
          this.user['role'] = 'admin'; 
          this.user['isOnBoarded'] = false;
          this.updateUserData(this.user);
          return afUser.user;
        });
  }

  requestPass(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  confirmPasswordReset(code, newPassword) { // param: oobCode=<code>
    return this.afAuth.auth.confirmPasswordReset(code, newPassword);
  }

  /*verifyPasswordResetCode(code){
    return this._firebaseAuth.auth.verifyPasswordResetCode(code);
  }*/

  signInWithEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }



    // Sets user data to firestore on login
  updateUserData = async (user) => {
    let compId:string = '';
   
     compId = user.company.charCodeAt(0) + user.company.charCodeAt(1) + user.uid
   
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    const compRef: AngularFirestoreDocument<any> = this.afs.doc(`company/${compId}`);
    let cdata = { 
      companyName: user.company, 
      createdAt: createdAt, 
      updatedAt: updatedAt
    } 
    await compRef.set( cdata, { merge: true});
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      company: user.company || null,
      role: user.role || 'other',
      isOnBoarded: user.isOnBoarded, 
      createdAt: createdAt, 
      updatedAt: updatedAt
    }
    return this.afs.doc(`company/${compId}/users/${user.uid}`).set(data, { merge: true })
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/auth/login']);
    });
  }

  // Used by the http interceptor to set the auth header
  getUserIdToken(): Observable<string> {
    return from( this.afAuth.auth.currentUser.getIdToken() );
  }

  
  ///// STRIPE CONNECT //////


  // // Login popup window
  // stripeLogin() {
  //   const popup = window.open(`${environment.functionsURL}/stripeRedirect`, '_blank', 'height=700,width=800')
  // }
  // // Signin with a custom token from 
  // customSignIn(token) {
  //   return this.afAuth.auth.signInWithCustomToken(token).then(() => window.close())
  // }

}