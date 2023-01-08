import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  name: any;
  showName: any;
  @ViewChild('samplesLink') siblingSamplesLink: ElementRef;
  @ViewChild('headerDiv') siblingheaderDiv: ElementRef;

  @Output() siblingSamples = new EventEmitter();
  @Output() siblingHeader = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (localStorage.getItem('name')) {
      this.name = localStorage.getItem('name');
      this.showName = true;
    } else {
      this.showName = false;
    }
  }

  ngAfterViewInit(): void {
    this.siblingSamples.emit(this.siblingSamplesLink);
    this.siblingHeader.emit(this.siblingheaderDiv);
  }
}
