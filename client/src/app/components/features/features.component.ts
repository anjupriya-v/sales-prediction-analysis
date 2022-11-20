import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent implements OnInit {
  @ViewChild('feature') siblingFeatureLink: ElementRef;
  @Output() siblingFeature = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.siblingFeature.emit(this.siblingFeatureLink);
  }
  featureData = [
    {
      image: '../../../assets/Images/predictFeature.jpg',
      title: 'Based On Periodicity',
      content:
        'Predict the sales record based on weekly, monthly, daily or yearly-basis. Process the data and provide the prediction accurately',
    },
    {
      image: '../../../assets/Images/visualizationFeature.jpg',
      title: 'Visualize the prediction',
      content:
        'Based on the prediction values, bar and line chart will be generated and Prediction metrics will be displayed. You can download the predicted csv file',
    },
    {
      image: '../../../assets/Images/saveFeature.jpg',
      title: 'Save your prediction',
      content:
        'You can save the prediction metrics along with visualization and prediction values for future purpose',
    },
  ];
}
