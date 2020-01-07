import {ChangeDetectorRef, Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inventory';
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  subUrl: string;

  constructor(private auth: AuthService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  activateRoute(event, elem: RouterOutlet) {
    this.subUrl = elem.activatedRoute.snapshot.routeConfig.path;
  }

  logout() {
    this.auth.logout();
  }

  get isLoggedIn() {
    return this.auth.isAuthenticated();
  }
}
