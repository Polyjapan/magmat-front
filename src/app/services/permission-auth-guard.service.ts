import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {LoginManager} from './login-manager.service';
import {Observable} from 'rxjs';
import {TokenStorageService} from '@japanimpact/angular-auth-framework';

@Injectable({
  providedIn: 'root',
})
export class PermissionAuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: LoginManager, private tokens: TokenStorageService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree | boolean> | UrlTree | boolean {
    const expectedGroup = route.data.group;

    const at = route.queryParamMap.get('accessToken');
    const rt = route.queryParamMap.get('refreshToken');

    if (!expectedGroup) {
      // If we don't require a perm, it means we only want the user to be logged in
      if (!this.authService.requiresLogin(state.url)) {
        return this.tryLogin(at, rt);
      }
      return true;
    } else {
      const ok = this.authService.requiresGroup(state.url, expectedGroup);

      if (!ok) {
        if (this.authService.isAuthenticated()) {
          return this.router.createUrlTree(['/']);
        } else {
          return this.tryLogin(at, rt);
        }
      }

      return ok;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  private tryLogin(access?: string, refresh?: string): UrlTree {
    if (access && refresh) {
      try {
        this.tokens.login(access, refresh);

        if (this.tokens.getAccessToken().grp.indexOf('magmat') < 0) {
          this.tokens.logout();
          return (this.router.createUrlTree(['login-failed', 'permissions']));
        }

        return this.authService.login(access, refresh);
      } catch (e) {
        return (this.router.createUrlTree(['login-failed', 'invalid']));
      }
    } else {
      return this.router.createUrlTree(['require-login']);
    }
  }
}
