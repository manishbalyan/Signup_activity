import {Component, OnInit, OnChanges, DoCheck} from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {composeAsyncValidators} from "@angular/forms/esm/src/directives/shared";
import {NgIf} from '@angular/common'
import {error} from "util";
@Component({
    selector: 'auth-container',
    directives: [REACTIVE_FORM_DIRECTIVES,NgIf],
    styles: [`
    .auth {
      height: 100%;
    }
    input {
      border-bottom: 1px solid lightgrey;
    }
    .ng-invalid.ng-dirty {
      border-bottom: 1px solid red;
    }
    form {
      width: 100%;
      border-radius: 2px;
      background-color: white;
      padding: 20px;
      height: 400px;
    }
    .inputs {
      height: 100%;
      position: relative;
    }
    .link {
      color: lightblue;
    }
    .link:hover {
      background-color: transparent;
    }
    .title {
      font-size: 36px;
      font-weight: 300;
      text-transform: capitalize;
    }
    .error {
      color: red;
      position: relative;
    }
  `],
    template: `
    <div class="auth row center-xs middle-xs">
      <form class="col-xs-6 shadow-2" (ngSubmit)="register(signupForm)" [formGroup]="signupForm">
        <div class="inputs row center-xs middle-xs">
          <h3 class="col-xs-8 title">
            {{ mode }}
          </h3>
          <input
            autocomplete="on"
            class="col-xs-8"
            type="mobileNumber"
            name="mob 9ileNumber"
            placeholder="Mobile Number"
            required
            maxlength="10"
            minlength="10"
            [formControl] = "mobileNumber"  
          >
          <div [hidden]="!phoneIsInvalid">{{error_text}}</div>

          <!--<button (click)="sendMobileNo(mobileNumber.value)">send</button>-->
          <!--<button (click)="senOtp(mobileNumber.value)">Generate Otp</button>-->
          <div>{{msg}}</div>
          <!--<div [hidden]="!mobileNumber.valid || !mobileNumber.untouched">-->
              <!--<div>Mobile Number must be 10 digit</div>-->
          <!--</div>-->
          <div *ngIf="otp_field">
                <input 
            class="col-xs-8"
            type="text"
            name="otp"
            placeholder="Otp"
            required
            [formControl] = "otp"
            maxlength="6"
          >
          
          
          </div>
          <input
            class="col-xs-8"
            type="email"
            name="email"
            placeholder="Email"
            required
            [formControl] = "email"
          >
         <div [hidden] = 'email.valid || email.untouched'>
              <div [hidden]="!password.hasError('needAtSignMark')" class="">
                        Your	password	must	have	an	 @ mark in your password.
              </div>
         </div>
          <input
            class="col-xs-8"
            type="password"
            name="password"
            placeholder="Password"
            required
            [formControl] = "password"
          >
          <div [hidden] = 'password.valid || password.untouched'>
               <div [hidden] = "!password.hasError('minlength')">password can not be shorter than 6 characters.</div>
                    <div [hidden]="!password.hasError('needAtSignMark')" class="">
                        Your	password	must	have	an	 @ mark in your password.
                    </div>
          </div>
          <div>
              <input type="text" class="col-xs-8" name="referral_code" placeholder="Referal Code" [formControl] = "referral_code" >
          </div>
          <div class="actions col-xs-12">
            <div class="row center-xs">
              <button
                
                type="submit"
                class="btn-light"
                 
              >
                {{ mode }}
              </button>
              <a (click)="changeMode()" class="btn-light link">
                {{ linkText }}
              </a>
           </div>
         </div>
        </div>
      </form>
    </div>
  `
})
export class Auth{
  signupForm:FormGroup;
  mobileNumber: FormControl;
  email:FormControl;
  password:FormControl;
  referral_code: FormControl;
  otp: FormControl;
  path: string = 'api/v1/users/check_phone_exists/';
  path1: string = 'api/v1/users/generate_otp/'
  path2: string = 'api/rest-auth/registration/v2/'
  msg :string;
  otp_field:boolean=false;
  public pattern_phone: "^[0-9]*$";
  public error_text = '';
  public phoneIsInvalid: boolean = false;

  ngOnInit() {
    this.mobileNumber.valueChanges
      .subscribe((data) => {

        var re = new RegExp('^[0-9]+$');
        let tempMob = data;

        if (re.test(data) && tempMob.length == 10) {
          console.log("Valid");
          console.log("data", data);

          //hit url
          this.sendMobileNo(data);
          this.phoneIsInvalid = false;


        } else {
          console.log("Invalid");

          this.phoneIsInvalid = true;
          this.error_text == 'MObile number is invalid';

        }
          //
          // if ( this.signupForm.controls['mobileNumber'].value.matches(this.pattern_phone) ){
          //   console.log('success matched');
          //
          //   this.phoneIsInvalid = false;
          // }else {
          //   console.log('INSIDE ELSE');
          //   this.phoneIsInvalid = true;
          //   this.error_text == 'MObile number is invalid';
          // }
      })
   //
   // this.signupForm.value.mobileNumber.valueChanges
   //   .subscribe((value: any)=> {
   //
   //
   //   });






  }


  hasAtSignMark (input:FormControl) { //take form control instance
    //return null if fine else return object which we used for .hasError method
    const hasAt = input.value.indexOf('@') >= 0;
    return hasAt ? null : {needAtSignMark: true};
  };

    mode: string = 'signin';
    linkText: string = 'Don\'t have an account?';


    constructor(private auth: AuthService, private router: Router, builder: FormBuilder) {
      this.mobileNumber = new FormControl('', [Validators.required, Validators.maxLength(10),])
      this.otp = new FormControl('', [Validators.required, Validators.maxLength(4)])
      this.email = new FormControl('', [Validators.required, this.hasAtSignMark, Validators.minLength(6)]);
      this.password = new FormControl('', [Validators.required, this.hasAtSignMark , Validators.minLength(6)]);
      this.referral_code = new FormControl('', []);

      this.signupForm = builder.group({
        mobileNumber: this.mobileNumber,
        otp: this.otp,
        email: this.email,
        password: this.password,
        referral_code: this.referral_code
      })
    }

    changeMode() {
        if (this.mode === 'signin') {
            this.mode = 'signup'
            this.linkText = 'Already have an account?'
        } else {
            this.mode = 'signin';
            this.linkText = 'Don\'t have an account?';
        }
    }

    register(signupForm) {
        this.auth.authenticate(this.path2, {email:this.signupForm.value.email, otp: this.signupForm.value.otp, password: this.signupForm.value.password, phone: this.signupForm.value.mobileNumber,referral_code: this.signupForm.value.referral_code})
            .subscribe()
    }
      sendMobileNo(mobile){
        console.log("VALID NUMBER",this.mobileNumber.valid);
        this.otp_field=true
        this.auth.authenticate(this.path, {phone:this.mobileNumber.value})
          .subscribe( (result) => {
            // console.log('data msg', data);
            // this.msg =JSON.stringify(data.msg);

            //hit otp generate url
              this.senOtp( this.mobileNumber.value );

          }
          )

      }
      senOtp(mobile_no: string){
        this.auth.authenticate(this.path1, {phone: mobile_no})
          .subscribe(data =>this.msg =JSON.stringify(data.msg))

      }
}
