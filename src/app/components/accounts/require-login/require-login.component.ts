import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {AuthApiService} from '@japanimpact/angular-auth-framework';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-require-login',
  templateUrl: './require-login.component.html',
  styleUrls: ['./require-login.component.css']
})
export class RequireLoginComponent implements OnInit {
  url = environment.auth.apiurl + '/login?app=' + environment.auth.clientId;

  constructor(private auth: AuthApiService, private router: Router) { }

  ngOnInit() {
    window.location.replace(this.auth.getLoginUrl(window.location.origin));
  }

}
