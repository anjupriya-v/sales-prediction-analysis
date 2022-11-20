import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FlaskapiService } from 'src/app/flaskapi.service';
import { GetSavedPrediction } from 'src/app/models/GetSavedPredictions';
import { BootstrapModalComponent } from '../bootstrap-modal/bootstrap-modal.component';
import { VisualizationComponent } from '../visualization/visualization.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.component.html',
  styleUrls: ['./prediction-result.component.css'],
  providers: [FlaskapiService],
})
export class PredictionResultComponent implements OnInit {
  predicted_date: any = [];
  predicted_column: any = [];
  title: string;
  mae: Number;
  mape: Number;
  mse: Number;
  rmse: Number;
  predictedColumnName: any;
  columnName: any;
  periodicity: any;
  numericalValue: any;
  public getCurrentPredictionSubscription: Subscription;
  public savePredictionSubscription: Subscription;
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
  moreInfoLink: ElementRef;
  predictionData: GetSavedPrediction;

  constructor(
    private router: Router,
    private flaskApiService: FlaskapiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.spinner.show('showPredictionResultSpinner');
    this.getPrediction();
  }

  ngOnDestroy() {
    if (this.getCurrentPredictionSubscription) {
      this.getCurrentPredictionSubscription.unsubscribe();
    }
    if (this.savePredictionSubscription) {
      this.savePredictionSubscription.unsubscribe();
    }
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
      'color: rgb(179, 179, 179) !important'
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

  getPrediction() {
    this.getCurrentPredictionSubscription = this.flaskApiService
      .getCurrentPrediction(localStorage.getItem('email'))
      .subscribe((response) => {
        this.title = response['data'].title;
        this.predicted_date = response['data'].predictedDate;
        this.predicted_column = response['data'].predictedColumn;
        this.predictedColumnName = response['data'].predictedColumnName;
        this.columnName = response['data'].columnName;
        this.mape = response['data'].mape.toFixed(3);
        this.mae = response['data'].mae.toFixed(3);
        this.rmse = response['data'].rmse.toFixed(3);
        this.mse = response['data'].mse.toFixed(3);
        this.numericalValue = response['data'].numericalValue;

        if (response['data'].periodicity == 'Yearly') {
          if (response['data'].numericalValue > 1) {
            this.periodicity = 'years';
          } else {
            this.periodicity = 'year';
          }
        } else if (response['data'].periodicity == 'Monthly') {
          if (response['data'].numericalValue > 1) {
            this.periodicity = 'months';
          } else {
            this.periodicity = 'month';
          }
        } else if (response['data'].periodicity == 'Weekly') {
          if (response['data'].numericalValue > 1) {
            this.periodicity = 'weeks';
          } else {
            this.periodicity = 'week';
          }
        } else {
          if (response['data'].numericalValue > 1) {
            this.periodicity = 'days';
          } else {
            this.periodicity = 'day';
          }
        }
        var visualizationObj = new VisualizationComponent();
        visualizationObj.linePlot(
          this.predictedColumnName,
          this.predicted_column,
          this.predicted_date,
          this.columnName
        );
        visualizationObj.barPlot(
          this.predictedColumnName,
          this.predicted_column,
          this.predicted_date,
          this.columnName
        );
        this.spinner.hide('showPredictionResultSpinner');
      });
  }

  savePrediction() {
    this.spinner.show('showSavePredictionSpinner');
    this.predictionData = {
      title: this.title,
      email: localStorage.getItem('email'),
      predicted_date: this.predicted_date,
      predicted_column: this.predicted_column,
      predictedColumnName: this.predictedColumnName,
      columnName: this.columnName,
      mape: this.mape,
      mae: this.mae,
      rmse: this.rmse,
      mse: this.mse,
      periodicity: this.periodicity,
      numericalValue: this.numericalValue,
    };
    this.savePredictionSubscription = this.flaskApiService
      .savePrediction(this.predictionData)
      .subscribe((response) => {
        this.router.navigate(['/saved-predictions']);
        this.toast.success(
          `Your prediction '${this.predictionData['title']}' has been saved`,
          'Wohoo!'
        );
      });
  }
  viewPredictionValues() {
    const modalRef = this.modalService.open(BootstrapModalComponent, {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      // keyboard: false,
      // backdrop: 'static',
    });

    let data = {
      predictedColumnName: this.predictedColumnName,
      predicted_date: this.predicted_date,
      predicted_column: this.predicted_column,
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (result) => {
        console.log('hello', result);
      },
      (reason) => {}
    );
  }
}
