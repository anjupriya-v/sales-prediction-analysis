import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  submitted: boolean = false;
  contactFormSubmitted: boolean = false;
  error: boolean = false;
  @ViewChild('contactUs') siblingContactUsLink: ElementRef;
  @Output() siblingContactUs = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.siblingContactUs.emit(this.siblingContactUsLink);
  }

  submitContactForm(e: Event) {
    this.submitted = true;
    if (this.contactForm.valid) {
      this.spinner.show();

      emailjs
        .sendForm(
          'service_XXX',
          'template_XXX',
          e.target as HTMLFormElement,
          'user_XXXXXXXXXXXXXX'
        )
        .then(
          (result: EmailJSResponseStatus) => {
            this.contactFormSubmitted = true;
            this.error = false;

            this.spinner.hide();
            this.submitted = false;
            this.contactForm.reset();
          },
          (error) => {
            this.contactFormSubmitted = false;
            this.error = true;
            this.spinner.hide();
            this.submitted = false;
            this.contactForm.reset();
          }
        );
      setTimeout(() => {
        this.contactFormSubmitted = false;
        this.error = false;
      }, 5000);
    }
  }
}
