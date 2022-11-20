import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  @ViewChild('about') siblingAboutLink: ElementRef;
  @Output() siblingAbout = new EventEmitter();
  constructor() {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.siblingAbout.emit(this.siblingAboutLink);
  }
}
