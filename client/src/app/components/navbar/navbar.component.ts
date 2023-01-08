import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import * as Aos from 'aos';
import { Subscription } from 'rxjs';
import { FlaskapiService } from 'src/app/flaskapi.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public getSavedPredictionsSubscription: Subscription;
  public signOutSubscription: Subscription;
  isLoggedIn: boolean;
  fullName: any;
  email: any;
  phoneNumber: any;
  @ViewChild('aboutLink') siblingAboutNavLink: ElementRef;
  @ViewChild('predictDatasetLink') siblingPredictDatasetNavLink: ElementRef;
  @ViewChild('samplesLink') siblingSamplesLink: ElementRef;
  @ViewChild('contactUsLink') siblingContactUsLink: ElementRef;
  @ViewChild('savedPredictionsLink') siblingSavedPredictionsLink: ElementRef;
  @ViewChild('navbarcontainer') siblingNavbarContainerElement: ElementRef;
  @ViewChild('navbrand') siblingNavBrandLink: ElementRef;
  @ViewChild('loginlink') siblingLoginLink: ElementRef;
  @ViewChild('home') siblingHomeLink: ElementRef;
  @ViewChild('features') siblingFeatureLink: ElementRef;
  @ViewChild('moreInfoLink') siblingMoreInfoLink: ElementRef;

  @Output() siblingAbout = new EventEmitter();
  @Output() siblingPredictDataset = new EventEmitter();
  @Output() siblingSamples = new EventEmitter();
  @Output() siblingContactUs = new EventEmitter();
  @Output() siblingSavedPredictions = new EventEmitter();
  @Output() siblingNavbarContainer = new EventEmitter();
  @Output() siblingNavBrand = new EventEmitter();
  @Output() siblingLogin = new EventEmitter();
  @Output() siblingHome = new EventEmitter();
  @Output() siblingFeature = new EventEmitter();
  @Output() siblingMoreInfo = new EventEmitter();

  constructor(
    private flaskApiService: FlaskapiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    console.log(Aos);
  }

  ngOnInit(): void {
    Aos.init();
    this.fullName = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
    this.phoneNumber = localStorage.getItem('phoneNumber');

    this.getSavedPredictions();
    if (localStorage.getItem('isLoggedIn') == 'false') {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.navbar') as HTMLElement;

    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('filledBackground');
    } else {
      element.classList.remove('filledBackground');
    }
  }

  ngAfterViewInit(): void {
    this.siblingAbout.emit(this.siblingAboutNavLink);

    this.siblingPredictDataset.emit(this.siblingPredictDatasetNavLink);
    this.siblingSamples.emit(this.siblingSamplesLink);
    this.siblingContactUs.emit(this.siblingContactUsLink);
    this.siblingSavedPredictions.emit(this.siblingSavedPredictionsLink);
    this.siblingNavbarContainer.emit(this.siblingNavbarContainerElement);
    this.siblingNavBrand.emit(this.siblingNavBrandLink);
    this.siblingLogin.emit(this.siblingLoginLink);
    this.siblingHome.emit(this.siblingHomeLink);
    this.siblingFeature.emit(this.siblingFeatureLink);
    this.siblingMoreInfo.emit(this.siblingMoreInfoLink);
  }
  ngOnDestroy() {
    if (this.getSavedPredictionsSubscription) {
      this.getSavedPredictionsSubscription.unsubscribe();
    }
    if (this.signOutSubscription) {
      this.signOutSubscription.unsubscribe();
    }
  }
  getSavedPredictions() {
    this.getSavedPredictionsSubscription = this.flaskApiService
      .getSavedPredictions(localStorage.getItem('email'))
      .subscribe((response) => {
        console.log(response);
      });
  }
  signOut() {
    this.spinner.show('signOut');
    this.signOutSubscription = this.flaskApiService
      .signOut()
      .subscribe((response) => {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', '');
        localStorage.setItem('count', '0');
        localStorage.setItem('show', 'false');
        localStorage.setItem('name', '');
        this.spinner.hide('signOut');
        this.toast.success(`You are logged out!`, 'Bye!');
        this.router.navigate(['/account']);
      });
  }
}
