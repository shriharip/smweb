import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { database } from 'firebase/app';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DbService {
users = [];
  constructor(private afs: AngularFirestore) {}

  collection$(path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  /**
   * @param  {string} path 'collection' or 'collection/docID'
   * @param  {object} data new data
   *
   * Creates or updates data on a collection or document.
   **/
  updateAt(path: string, data: Object, includeCreated?:boolean): Promise<any> {
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
      // Odd is always a collection
      data = {...data, createdAt: createdAt, updatedAt: createdAt }
      return this.afs.collection(path).add(data);
    } else {
      if(includeCreated) {
        data = {...data, createdAt: createdAt, updatedAt: updatedAt }
      } else{
        data = {...data, updatedAt: updatedAt }
      }
     
      // Even is always document
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  /**
   * @param  {string} path path to document
   *
   * Deletes document from Firestore
   **/
  delete(path) {
    return this.afs.doc(path).delete();
  }

  // get users for table and more

  getUsers = () =>{

   return this.afs.collection('users', ref => ref.where('role', '==', 'employee') ).valueChanges();

  }

 
}