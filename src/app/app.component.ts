import {ChangeDetectorRef, Component} from '@angular/core';
import {LoginManager} from './services/login-manager.service';
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import {RouterOutlet} from '@angular/router';
import {map, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inventory';
  subUrl: string;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private auth: LoginManager) {
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
