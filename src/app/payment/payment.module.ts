import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';


// import { PaymentFormComponent } from './payment-form/payment-form.component';
// import { PaymentService } from './payment.service';
// import { UserChargesComponent } from './user-charges/user-charges.component';
// import { UserSourcesComponent } from './user-sources/user-sources.component';
// import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
// import { UserSubscriptionsComponent } from './user-subscriptions/user-subscriptions.component';
// import { ConnectRedirectComponent } from './connect-redirect/connect-redirect.component';

@NgModule({
  imports: [
    // CommonModule,
    // SharedModule,
    // HttpClientModule
  ],
  declarations: [
    // PaymentFormComponent,
    // UserChargesComponent, 
    // UserSourcesComponent, 
    // SubscriptionPlanComponent,
    // UserSubscriptionsComponent, 
    // ConnectRedirectComponent
  PaymentComponent],
  exports: [
    // PaymentFormComponent, 
    // UserChargesComponent, 
    // UserSourcesComponent, 
    // SubscriptionPlanComponent, 
    // UserSubscriptionsComponent, 
    // ConnectRedirectComponent
  ],
  providers: [
    //PaymentService
  ]
})
export class PaymentModule { }