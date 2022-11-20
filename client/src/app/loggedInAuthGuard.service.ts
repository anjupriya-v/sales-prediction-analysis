import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  // isLoggedIn: Boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('isLoggedIn') == 'true') {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  // loggedInAuth(data: any) {
  //   this.isLoggedIn = data;
  // }
}
