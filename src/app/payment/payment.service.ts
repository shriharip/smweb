import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Customer, Source, Charge, SubscriptionPlan, StripeObject } from './models';



@Injectable()
export class PaymentService {

  readonly api = `${environment.functionsURL}`;

  private stripe = Stripe(environment.stripePublishable);
  elements: any;

  constructor(private http: HttpClient) {
    this.elements = this.stripe.elements()
  }
///create customer

createCustomer(companyData: any) {
  const url = `${this.api}/customer/`;

  return this.http.post(url, {companyRef: companyData});
}


  ///// RETRIEVE DATA ////

  // Get customer data
  getCustomer(): Observable<Customer> {
    const url = `${this.api}/customer/`;

    return this.http.get<Customer>(url);
  }

  // Get a list of charges
  getCharges(): Observable<Charge[]> {
    const url = `${this.api}/charges/`;

    return this.http.get<StripeObject>(url).pipe(map(res => res.data));
  }


  ///// PAYMENT ACTIONS ////


  createCharge(card: any, amount: number): Observable<Charge> {
    const url = `${this.api}/charges/`;

    return from<Source>( this.stripe.createSource(card) ).pipe(
      switchMap(data => {
        return this.http.post<Charge>(url, { amount, sourceId: data.source.id })
      })
    )
  }

  // Saves a payment source to the user account that can be charged later
  attachSource(card: any, companyData): Observable<Source> {
    const url = `${this.api}/sources/`;
    
    return from<Source>( this.stripe.createSource(card) ).pipe(
      switchMap(data => {
        return this.http.post<Source>(url, { sourceId: data.source.id, companyRef: companyData })
      })
    )
  }


  ///// SUBSCRIPTION ACTIONS ////

  // Attaches subscription to user (Stripe will charge the source)
  attachSubscription(sourceId: string, planId: string): Observable<SubscriptionPlan> {
      const url = `${this.api}/subscriptions`;
      
      return this.http.post<SubscriptionPlan>(url, { sourceId, planId });
  }

  // Cancels subscription
  cancelSubscription(planId: string): Observable<SubscriptionPlan> {
    const url = `${this.api}/subscriptions/cancel`;
    
    return this.http.put<SubscriptionPlan>(url, { planId });
  }

//Ticket Order from app redirected to here
orderTicket(card: any, amount: number): Observable<Charge> {
  const url = `${this.api}/orderTicket/`;

  return from<Source>( this.stripe.createSource(card) ).pipe(
    switchMap(data => {
      return this.http.post<Charge>(url, { amount, sourceId: data.source.id })
    })
  )
}

} 