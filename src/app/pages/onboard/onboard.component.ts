
import { Component, AfterViewInit, OnDestroy, ViewChild,
  ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from "./../../core/data/state.service";
import { PaymentService } from './../../payment/payment.service';
import { DbService } from './../../core/data/firestore.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Charge, Source } from './../../payment/models';
import { AuthService } from './../../auth/auth.service'
@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit, AfterViewInit, OnDestroy  {

    // Result used locacally to display status.
    result: Charge | Source;
    displayName:string;
    uid: string;
    // The Stripe Elements Card
    @ViewChild('cardElement') cardElement: ElementRef;
    
    card: any;
    formError: string; 
    formComplete = false
    
    // State of async activity
    loading = false;

  companyForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  isCompVisible: boolean = false;

  constructor(private fb: FormBuilder, private state: StateService, public pmt: PaymentService, private cd: ChangeDetectorRef, 
    private router: Router, private db: DbService,  private route: ActivatedRoute, protected auth: AuthService) {

      this.uid = localStorage.getItem("user");
      this.displayName = localStorage.getItem("displayName")

  }


  ngOnInit() {

    this.companyForm = this.fb.group({
   //   uid: ['', Validators.required],
      id: ['', Validators.required],
      name: [this.displayName, Validators.required],
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
    console.log(this.uid, this.displayName)
   // this.companyForm.get('name').setValue(this.user.displayName)
  }
  getCompany = () => {
    let id = this.companyForm.value.id
    this.state.getCompany(id).subscribe(data=> {
      console.log(data);
      this.isCompVisible = true;
      let resp = data['results'][0];
      this.companyForm.get('name').setValue(resp.name);
      let address = resp.addresses[0].street + " ," + resp.addresses[0].postCode + " " + resp.addresses[0].city
      this.companyForm.get('address').setValue(address);
    })
  }

  onFirstSubmit() {
    //this.companyForm.markAsDirty();
   // console.log(this.companyForm.value.name)
    let compId =  this.companyForm.value.name.charCodeAt(0) + this.companyForm.value.name.charCodeAt(1) + this.uid;
    let compData = {
    UID: compId,
    VAT : this.companyForm.value.id, 
    name: this.companyForm.value.name, 
    address: this.companyForm.value.address
    }
 this.db.updateAt(`company/${compId}` , compData);
// this.pmt.createCustomer(compData).subscribe(data=> console.log(data))
  }

  onSecondSubmit(): void {

    this.loading = true;
    let compId =  this.companyForm.value.name.charCodeAt(0) + this.companyForm.value.name.charCodeAt(1) + this.uid;
    let compData = {
    UID: compId,
    VAT : this.companyForm.value.id, 
    name: this.companyForm.value.name, 
    address: this.companyForm.value.address
    }
    let action;

       action = this.pmt.attachSource(this.card, compData)
 
    action.subscribe(
      data => {
        this.result = data
        console.log(data)
      //  this.stripeResult.emit(data)
        this.loading = false
      },
      err => {
        this.result = err
        this.loading = false;
      }
    );
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  dnavigate(): void {
   let data = { isOnBoarded: true};
   this.db.updateAt(`users/${this.uid}` , data)
    this.router.navigate(['pages/dashboard'])
  }

  ngOnDestroy() {
    this.card.destroy();
  }

}
