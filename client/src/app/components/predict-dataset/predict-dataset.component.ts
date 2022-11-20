import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GetData } from 'src/app/models/GetData';
import { FlaskapiService } from 'src/app/flaskapi.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-predict-dataset',
  templateUrl: './predict-dataset.component.html',
  styleUrls: ['./predict-dataset.component.css'],
  providers: [FlaskapiService],
})
export class PredictDatasetComponent implements OnInit {
  public predictDatasetSubscription: Subscription;
  aboutLink: ElementRef;
  predictDatasetLink: ElementRef;
  contactUsLink: ElementRef;
  savedPredictionsLink: ElementRef;
  navbarContainer: ElementRef;
  navBrand: ElementRef;
  home: ElementRef;
  featureLink: ElementRef;
  samplesLink: ElementRef;
  moreInfoLink: ElementRef;
  predictForm: FormGroup;
  submitted: boolean = false;
  formData: any;
  public file: any;

  constructor(
    private flaskApiService: FlaskapiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.predictForm = this.formBuilder.group({
      file: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(25)]],
      predictColumn: ['', Validators.required],
      periodicity: ['', Validators.required],
      numericalValue: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngAfterViewInit(): void {
    this.savedPredictionsLink.nativeElement.setAttribute(
      'style',
      'color: rgb(179, 179, 179) !important'
    );
    this.moreInfoLink.nativeElement.setAttribute(
      'style',
      'color: rgb(179, 179, 179) !important'
    );
    this.aboutLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );
    this.predictDatasetLink.nativeElement.setAttribute(
      'style',
      'color: white !important'
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

    this.home.nativeElement.setAttribute(
      'style',
      'color: rgb(179, 179, 179) !important'
    );
  }
  ngOnDestroy() {
    if (this.predictDatasetSubscription) {
      this.predictDatasetSubscription.unsubscribe();
    }
  }
  getFile(event: any) {
    this.file = event.target.files[0];
  }

  submitData() {
    this.submitted = true;
    if (this.predictForm.valid) {
      this.spinner.show();
      this.formData = {
        title: this.predictForm.controls['title'].value,
        predictColumn: this.predictForm.controls['predictColumn'].value,
        periodicity: this.predictForm.controls['periodicity'].value,
        numericalValue: this.predictForm.controls['numericalValue'].value,
      };
      this.predictDatasetSubscription = this.flaskApiService
        .postData(this.formData, this.file, localStorage.getItem('email'))
        .subscribe((response) => {
          localStorage.setItem('show', 'true');
          this.router.navigate(['/prediction-result']);
          this.submitted = false;
        });
    }
  }
}
