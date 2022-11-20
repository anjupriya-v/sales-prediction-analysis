import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanDeactivate,
} from '@angular/router';

@Injectable()
export class PredictionResultAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  isLoggedIn: Boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      localStorage.getItem('isLoggedIn') == 'true' &&
      localStorage.getItem('show') == 'true'
    ) {
      return true;
    }
    this.router.navigate(['/predict-dataset']);
    return false;
  }
}
