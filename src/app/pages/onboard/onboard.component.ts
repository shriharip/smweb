
import { Component, AfterViewInit, OnDestroy, ViewChild,
  ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from "./../../core/data/state.service";
import { PaymentService } from './../../payment/payment.service';
import { DbService } from './../../core/data/firestore.service'
import { Router, ActivatedRoute } from '@angular/router';

import { Charge, Source } from './../../payment/models';

@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit, AfterViewInit, OnDestroy {

    // Result used locacally to display status.
    result: Charge | Source;
    uid: any;
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
    private router: Router, private db: DbService,  private route: ActivatedRoute,) {
  }


  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');

    this.companyForm = this.fb.group({
      id: ['', Validators.required],
      name: [''],
      address: [''],
    });

    this.secondForm = this.fb.group({
     
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.card = this.pmt.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    // Listens to change event on the card for validation errors
    this.card.on('change', (evt) => {
      this.formError = evt.error ? evt.error.message : null
      this.formComplete = evt.complete
      this.cd.detectChanges()
    })
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
    this.companyForm.markAsDirty();

    let compData = {
    VAT : this.companyForm.value.id, 
    name: this.companyForm.value.name, 
    address: this.companyForm.value.address
    }
  this.db.updateAt(`users\${this.uid}\company` , compData)

  }

  onSecondSubmit(): void {
    this.loading = true
    let action;

       action = this.pmt.attachSource(this.card)
 
    action.subscribe(
      data => {
        this.result = data
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
    this.router.navigate(['pages/dashboard'])
  }

  ngOnDestroy() {
    this.card.destroy();
  }

}
