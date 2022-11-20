import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanDeactivate,
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  isLoggedIn: Boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      localStorage.getItem('isLoggedIn') != null &&
      localStorage.getItem('isLoggedIn') == 'true'
    ) {
      return true;
    }
    localStorage.setItem('isLoggedIn', 'false');
    this.router.navigate(['/account']);
    return false;
  }
}
