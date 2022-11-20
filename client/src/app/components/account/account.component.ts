import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthGuard } from 'src/app/authguard.service';
import { FlaskapiService } from 'src/app/flaskapi.service';
import { SignInData } from 'src/app/models/SignInData';
import { SignUpData } from 'src/app/models/SignUpData';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [FlaskapiService],
})
export class AccountComponent implements OnInit {
  public signInSubscription: Subscription;
  public signUpSubscription: Subscription;
  signInForm: FormGroup;
  signInFormData: any;
  signUpForm: FormGroup;
  signUpFormData: any;
  actions: string = 'Login';
  signInError: any;
  showSignInError: any;
  signUpError: any;
  showSignUpError: any;
  signInSubmitted: boolean = false;
  signUpSubmitted: boolean = false;
  @ViewChild('signupform') signup: ElementRef;
  @ViewChild('loginform') login: ElementRef;
  aboutLink: ElementRef;
  predictDatasetLink: ElementRef;
  contactUsLink: ElementRef;
  savedPredictionsLink: ElementRef;
  navbarContainer: ElementRef;
  navBrand: ElementRef;
  loginLink: ElementRef;
  home: ElementRef;
  featureLink: ElementRef;
  samplesLink: ElementRef;
  constructor(
    private flaskApiService: FlaskapiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngAfterViewInit(): void {
    this.aboutLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );

    this.contactUsLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );
    this.featureLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );
    this.samplesLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );
    this.navbarContainer.nativeElement.classList.add('bg-dark');
    this.navBrand.nativeElement.setAttribute(
      'style',
      'color: white !important'
    );
    this.loginLink.nativeElement.setAttribute(
      'style',
      'color: white !important'
    );
    this.home.nativeElement.setAttribute(
      'style',
      'color: rgb(179, 179, 179) !important'
    );
  }
  ngOnDestroy() {
    if (this.signInSubscription) {
      this.signInSubscription.unsubscribe();
    }
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
  }
  showSignUp() {
    this.actions = 'Sign Up';
    this.signup.nativeElement.setAttribute('style', 'display:block !important');
    this.login.nativeElement.setAttribute('style', 'display:none !important');
  }
  showLogin() {
    this.actions = 'Login';

    this.signup.nativeElement.setAttribute('style', 'display:none !important');
    this.login.nativeElement.setAttribute('style', 'display:block !important');
  }
  signIn() {
    this.signInSubmitted = true;
    if (this.signInForm.valid) {
      this.spinner.show('signIn');

      this.signInFormData = {
        email: this.signInForm.controls['email'].value,
        password: this.signInForm.controls['password'].value,
      };
      this.signInSubscription = this.flaskApiService
        .signIn(this.signInFormData)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.showSignInError = false;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem(
              'name',
              response['data']['userInfo']['fullName']
            );

            localStorage.setItem(
              'email',
              response['data']['userInfo']['email']
            );
            localStorage.setItem(
              'count',
              response['data']['userInfo']['count']
            );
            localStorage.setItem(
              'phoneNumber',
              response['data']['userInfo']['phoneNumber']
            );
            this.spinner.hide('signIn');
            this.toast.success(
              `Logged in as ${localStorage.getItem('email')}`,
              'Wohoo!'
            );

            this.router.navigate(['/']);
          },
          error: (error) => {
            this.spinner.hide('signIn');

            this.signInError = error['error']['text'];
            this.showSignInError = true;
          },
        });
      this.signInSubmitted = false;
    }
  }
  signUp() {
    this.signUpSubmitted = true;

    if (this.signUpForm.valid) {
      this.spinner.show('signUp');

      this.signUpFormData = {
        fullName: this.signUpForm.controls['fullName'].value,
        email: this.signUpForm.controls['email'].value,
        phoneNumber: this.signUpForm.controls['phoneNumber'].value,
        password: this.signUpForm.controls['password'].value,
      };
      this.signUpSubscription = this.flaskApiService
        .signUp(this.signUpFormData)
        .subscribe({
          next: (response) => {
            this.showSignUpError = false;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem(
              'name',
              response['data']['userInfo']['fullName']
            );

            localStorage.setItem(
              'email',
              response['data']['userInfo']['email']
            );
            localStorage.setItem(
              'count',
              response['data']['userInfo']['count']
            );
            localStorage.setItem(
              'phoneNumber',
              response['data']['userInfo']['phoneNumber']
            );
            this.spinner.hide('signUp');
            this.toast.success(
              `Logged in as ${localStorage.getItem('email')}`,
              'Wohoo!'
            );
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.spinner.hide('signUp');

            this.signUpError = error['error']['text'];
            this.showSignUpError = true;
          },
        });
      this.signUpSubmitted = false;
    }
  }
  changeSignInInput() {
    this.showSignInError = false;
  }
  changeSignUpInput() {
    this.showSignUpError = false;
  }
}
