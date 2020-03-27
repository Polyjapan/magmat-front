import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router, UrlTree} from '@angular/router';
import {environment} from '../../environments/environment';
import {TokenStorageService} from '@japanimpact/angular-auth-framework';

export class UserSession {
  groups: string[];
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoginManager {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private route: Router, private tokens: TokenStorageService) {
  }

  login(access: string, refresh: string): UrlTree {
    this.tokens.login(access, refresh);

    let act = this.loadNextAction();

    if (!act || act.startsWith('/?accessToken=')) {
      act = '/';
    }

    return this.route.createUrlTree([act]);
  }

  requiresLogin(redirectTo: string): boolean {
    if (this.tokens.isAuthenticated()) {
      return true;
    } else {
      this.storeNextAction(redirectTo);
      return false;
    }
  }

  requiresGroup(redirectTo: string, group: string): boolean {
    if (this.requiresLogin(redirectTo)) {
      return this.hasGroup(group);
    }
    return false;
  }

  public logout(): void {
    this.tokens.logout();
    window.location.replace(environment.auth.apiurl + '/logout?app=' + environment.auth.clientId);
  }

  public getToken(): UserSession {
    const token = this.tokens.getAccessToken();

    if (token) {
      return {groups: token.grp, userId: token.uid};
    } else {
      return null;
    }
  }

  public hasGroup(group: string): boolean {
    return this.tokens.hasGroup(group);
  }

  public isAuthenticated(): boolean {
    return this.tokens.isAuthenticated();
  }

  private storeNextAction(action: string) {
    localStorage.setItem('_post_login_action', action);
  }

  private loadNextAction(): string {
    const act = localStorage.getItem('_post_login_action');
    localStorage.removeItem('_post_login_action');

    return act;
  }
}
