import { Component } from '@angular/core';
declare let AOS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    console.log(AOS); // loaded script
  }
  title = 'client';
  current: any;
  ngOnInit() {
    AOS.init();
    if (localStorage.getItem('isLoggedIn') == null) {
      localStorage.setItem('isLoggedIn', 'false');
    }
  }
}
