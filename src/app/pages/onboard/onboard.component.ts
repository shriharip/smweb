
import { Component, AfterViewInit, OnDestroy, ViewChild,
  ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from "./../../core/data/state.service";
import { PaymentService } from './../../payment/payment.service';
import { DbService } from './../../core/data/firestore.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Charge, Source } from './../../payment/models';
import { AuthService } from './../../auth/auth.service'

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit, AfterViewInit, OnDestroy  {

    // Result used locacally to display status.
    result: string;
    displayName:string;
    uid: string;
    // The Stripe Elements Card
    @ViewChild('cardElement') cardElement: ElementRef;
    
    card: any;
    formError: string; 
    formComplete = false;
    showLastStep = false;
    // State of async activity
    loading = false;
compData: Observable<any>;
compId: string;
  companyForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  isCompVisible: boolean = false;

  constructor(private fb: FormBuilder, private state: StateService, public pmt: PaymentService, private cd: ChangeDetectorRef, 
    private router: Router, private db: DbService,  private route: ActivatedRoute, protected auth: AuthService) {

      this.uid = localStorage.getItem("user");
      this.displayName = localStorage.getItem("displayName")
      this.compId = this.displayName.charCodeAt(0) + this.displayName.charCodeAt(1) + this.uid;
  }


  ngOnInit() {

    
    this.companyForm = this.fb.group({
   //   uid: ['', Validators.required],
      id: ['', Validators.required],
      name: [{value: this.displayName, disabled: true}],
      address: ['', Validators.required],
    });
        this.secondForm = this.fb.group({
     
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  

  this.card = this.pmt.elements.create('card');
  this.card.mount(this.cardElement.nativeElement);

  // Listens to change event on the card for validation errors
  this.card.on('change', (evt) => {
    this.formError = evt.error ? evt.error.message : null
    this.formComplete = evt.complete
    this.cd.detectChanges()
  });

  };

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.companyForm.get('name').setValue(this.user.displayName)
   this.db.doc$(`company/${this.compId}`).subscribe(
      data => {
        this.companyForm.patchValue({
          id: data.VAT,
          address: data.address
        })
      })
  }
  // getCompany = () => {
  //   let id = this.companyForm.value.id
  //   this.state.getCompany(id).subscribe(data=> {
  //     console.log(data);
  //     this.isCompVisible = true;
  //     let resp = data['results'][0];
  //     this.companyForm.get('name').setValue(resp.name);
  //     let address = resp.addresses[0].street + " ," + resp.addresses[0].postCode + " " + resp.addresses[0].city
  //     this.companyForm.get('address').setValue(address);
  //   })
  // }

  onFirstSubmit() {
    //this.companyForm.markAsDirty();
   // console.log(this.companyForm.value.name)
    let compData = { 
    VAT : this.companyForm.value.id,   
    address: this.companyForm.value.address
    }
   this.db.updateAt(`company/${this.compId}` , compData);
  this.pmt.createCustomer(compData).pipe(tap(data => data) )
  }

  onSecondSubmit(): void {

    this.loading = true;
    let compData = {
    UID: this.compId,
    VAT : this.companyForm.value.id, 
    name: this.companyForm.value.name, 
    address: this.companyForm.value.address
    }
    let action;

    //   action = this.pmt.attachSource(this.card, compData)
    setTimeout(() => {
      this.result = "Card saved successfully"
      this.loading = false
        this.showLastStep = true
    }, 2000);

    action.subscribe(
      data => {
        this.result = "Card saved successfully";
        this.loading = false;
        this.showLastStep = true;
      //  this.stripeResult.emit(data)
        
      },
      err => {
        this.result = err.message;
        this.loading = false;
      }
    );
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  dnavigate(): void {
    let isOnBoarded = localStorage.getItem("isOnBoarded");
    if(isOnBoarded) {
      localStorage.removeItem("isOnBoarded");
    }
   let data = { isOnBoarded: true};
   this.db.updateAt(`company/${this.compId}/users/${this.uid}` , data)
    this.router.navigate(['pages/dashboard'])
  }

  ngOnDestroy() {
    this.card.destroy();
  }

}
