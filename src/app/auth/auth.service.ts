import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

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
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
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
          afUser.user.updateProfile({
            displayName: fullName,
            photoURL: ""
          });
          // Create the user in firestore
          this.user['uid'] = afUser.user.uid;
          this.user['displayName'] = afUser.user.displayName;
          this.user['company'] = company;
          this.user['email'] = afUser.user.email;
          this.user['photoURL'] = afUser.user.photoURL;
          this.user['role'] = 'admin'; 
          this.updateUserData(this.user);
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
  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      company: user.company || null,
      role: user.role || 'employee'
    }
    return userRef.set(data, { merge: true })
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