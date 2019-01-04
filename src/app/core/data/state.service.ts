import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf,  Observable,  BehaviorSubject, throwError } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { LocalStorage } from '@ngx-pwa/local-storage';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

// const companyApiURL = 'https://avoindata.prh.fi/bis/v1/';
const baseURL = '/api'

@Injectable()
export class StateService implements OnDestroy {


  constructor(private http: HttpClient, protected storage:LocalStorage) {

  }
  
  getCompany =  (_id) => {
    let _url = baseURL + '/' + _id;
    console.log(_url)
   // return this.http.get(_url, httpOptions )
   return this.http.get(_url)
  .pipe(
    catchError(this.handleError)
  );
  }

  setStorage(key:string, data:any) {
   return this.storage.setItem(key, data);
  }
  
  getStorage(key:string) {
    return this.storage.getItem(key);
  }

  deleteStorage(key:string) {
   return this.storage.removeItem(key);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
