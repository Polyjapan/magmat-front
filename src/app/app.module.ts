import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from './services/auth.service';
import {environment} from '../environments/environment';
import {JwtModule} from '@auth0/angular-jwt';
import {LoginFailedComponent} from './components/accounts/login-failed/login-failed.component';
import {RequireLoginComponent} from './components/accounts/require-login/require-login.component';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatInputModule, MatAutocompleteModule, MatSelectModule, MatTableModule, MatProgressSpinnerModule, MatDialogModule
}
  from '@angular/material';
import {AppRoutingModule} from './app-routing.module';
import {LoginService} from './services/login.service';
import {HttpClientModule} from '@angular/common/http';
import {FlexModule} from '@angular/flex-layout';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ObjectTypesComponent } from './components/object-types/object-types.component';
import { CreateObjectTypeComponent } from './components/create-object-type/create-object-type.component';
import { CreateExternalLoanComponent } from './components/create-external-loan/create-external-loan.component';
import {FormsModule} from '@angular/forms';
import { ShowObjectTypeComponent } from './components/show-object-type/show-object-type.component';
import { SelectLoanComponent } from './components/selectors/select-loan/select-loan.component';
import { SelectStorageComponent } from './components/selectors/select-storage/select-storage.component';
import { ObjectComponent } from './components/object/object.component';
import { SelectUserComponent } from './components/selectors/select-user/select-user.component';

function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFailedComponent,
    RequireLoginComponent,
    SidebarComponent,
    NotFoundComponent,
    ObjectTypesComponent,
    CreateObjectTypeComponent,
    CreateExternalLoanComponent,
    ShowObjectTypeComponent,
    SelectLoanComponent,
    SelectStorageComponent,
    ObjectComponent,
    SelectUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    AppRoutingModule,
    MatProgressBarModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [environment.apidomain]
      }
    }),
    FlexModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,

  ],
  providers: [
    AuthService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
