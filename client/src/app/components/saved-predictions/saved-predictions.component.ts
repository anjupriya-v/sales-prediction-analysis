import { ResourceLoader } from '@angular/compiler';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FlaskapiService } from 'src/app/flaskapi.service';
import { BootstrapModalComponent } from '../bootstrap-modal/bootstrap-modal.component';
import { VisualizationComponent } from '../visualization/visualization.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-saved-predictions',
  templateUrl: './saved-predictions.component.html',
  styleUrls: ['./saved-predictions.component.css'],
  providers: [FlaskapiService],
})
export class SavedPredictionsComponent implements OnInit {
  copyPredictionData: any[] = [];
  predictionData: any[] = [];
  sorted: any[] = [];
  filteredItems = [];
  resultNotFound: boolean;
  predictionsSaved: boolean;
  show: boolean;
  count: any;
  showLoader: boolean = true;
  public getSavedPredictionsSubscription: Subscription;
  public deletePredictionSubscription: Subscription;
  aboutLink: ElementRef;
  predictDatasetLink: ElementRef;
  contactUsLink: ElementRef;
  navBrand: ElementRef;
  home: ElementRef;
  navbarContainer: ElementRef;
  savedPredictionsLink: ElementRef;
  samplesLink: ElementRef;
  featureLink: ElementRef;
  moreInfoLink: ElementRef;
  constructor(
    private flaskApiService: FlaskapiService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.spinner.show('getPredictions');
    }, 0);
    this.getSavedPrediction();
  }
  ngOnDestroy() {
    if (this.getSavedPredictionsSubscription) {
      this.getSavedPredictionsSubscription.unsubscribe();
    }
    if (this.deletePredictionSubscription) {
      this.deletePredictionSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.aboutLink.nativeElement.setAttribute(
      'style',
      'display: none !important'
    );
    this.predictDatasetLink.nativeElement.setAttribute(
      'style',
      'color: rgb(179, 179, 179) !important'
    );
    this.moreInfoLink.nativeElement.setAttribute(
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
    this.savedPredictionsLink.nativeElement.setAttribute(
      'style',
      'color: white !important'
    );
  }

  getArraySorted(unsortedArray: []) {
    this.sorted = unsortedArray.sort(function compare(a: any, b: any) {
      var dateA: any = new Date(a.dateAndTime);
      var dateB: any = new Date(b.dateAndTime);
      return dateB - dateA;
    });
  }
  getPredictionDataArray() {
    this.predictionData = [];
    this.sorted.forEach((val: any) => {
      return this.predictionData.push(Object.assign({}, val));
    });
  }
  getSavedPrediction() {
    this.getSavedPredictionsSubscription = this.flaskApiService
      .getSavedPredictions(localStorage.getItem('email'))
      .subscribe((response) => {
        if (response['data'][0]['predictionData']) {
          this.getArraySorted(response['data'][0]['predictionData']);
          this.getPredictionDataArray();
          this.copyPredictionData = this.predictionData;
          if (
            this.copyPredictionData.length == 0 ||
            this.predictionData.length == 0
          ) {
            this.predictionsSaved = false;
          } else {
            this.predictionsSaved = true;
          }
        }
        localStorage.setItem('count', response['data'][0]['count']);
        this.count = localStorage.getItem('count');
        this.count = parseInt(this.count, 10);
        if (this.count > 0) {
          this.show = true;
        } else {
          this.show = false;
        }
        localStorage.setItem('show', 'true');
        this.spinner.hide('getPredictions');
        this.showLoader = false;
      });
  }

  visualization(
    predicted_date: any[],
    predicted_column: any[],
    predictedColumnName: any,
    columnName: any
  ) {
    let visualizationObj = new VisualizationComponent();
    visualizationObj.linePlot(
      predictedColumnName,
      predicted_column,
      predicted_date,
      columnName
    );

    visualizationObj.barPlot(
      predictedColumnName,
      predicted_column,
      predicted_date,
      columnName
    );
  }

  sendPredictedValues(
    predictedColumnName: any,
    predicted_date: any[],
    predicted_column: any[]
  ) {
    const modalRef = this.modalService.open(BootstrapModalComponent, {
      scrollable: true,
      windowClass: 'myCustomModalClass',
      // keyboard: false,
      // backdrop: 'static',
    });

    let data = {
      predictedColumnName,
      predicted_date,
      predicted_column,
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {}
    );
  }

  deletePrediction(dateAndTime: any, title: any) {
    this.spinner.show('deletePrediction');

    this.deletePredictionSubscription = this.flaskApiService
      .deletePrediction(dateAndTime, localStorage.getItem('email'))
      .subscribe((response) => {
        const i = this.predictionData.findIndex(
          (e) => e.dateAndTime === dateAndTime
        );
        if (i != -1) {
          this.predictionData.splice(i, 1);
        }
        this.getSavedPrediction();
        this.spinner.hide('deletePrediction');

        this.toast.error(`${title}  has been deleted`, 'Alas!');
      });
  }

  assignCopy() {
    this.predictionData = Object.assign([], this.copyPredictionData);
  }

  searchPrediction(value: any) {
    console.log(value);
    if (!value) {
      this.assignCopy();
    }
    this.predictionData = Object.assign([], this.copyPredictionData).filter(
      (item: any) =>
        item['title'].toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    if (
      this.predictionData.length == 0 &&
      this.copyPredictionData.length != 0
    ) {
      this.resultNotFound = true;
    } else {
      this.resultNotFound = false;
    }
  }
}
