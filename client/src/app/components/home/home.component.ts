import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  aboutLink: ElementRef;
  about: ElementRef;
  samplesLinkNav: ElementRef;
  samplesLink: ElementRef;
  samples: ElementRef;
  contactUsLink: ElementRef;
  contactUs: ElementRef;
  feature: ElementRef;
  featureLink: ElementRef;
  homeLink: ElementRef;
  header: ElementRef;

  current: any;
  logInAlert: boolean;
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.logInAlert = false;
    } else {
      this.current = 'Please login to start predicting!';
      this.logInAlert = true;
    }
  }

  ngAfterViewInit(): void {
    this.aboutLink.nativeElement.addEventListener('click', () => {
      this.about.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });

    this.samplesLink.nativeElement.addEventListener('click', () => {
      this.samples.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
    this.featureLink.nativeElement.addEventListener('click', () => {
      this.feature.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
    this.samplesLinkNav.nativeElement.addEventListener('click', () => {
      this.samples.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
    this.contactUsLink.nativeElement.addEventListener('click', () => {
      this.contactUs.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
    this.homeLink.nativeElement.addEventListener('click', () => {
      this.header.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });
  }
}
