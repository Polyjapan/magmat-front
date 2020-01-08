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
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDatepickerModule, MatNativeDateModule
}
  from '@angular/material';
import {AppRoutingModule} from './app-routing.module';
import {LoginService} from './services/login.service';
import {HttpClientModule} from '@angular/common/http';
import {FlexModule} from '@angular/flex-layout';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ObjectTypesComponent } from './components/object-types/object-types.component';
import { CreateObjectTypeComponent } from './components/object-types/create-object-type/create-object-type.component';
import { CreateExternalLoanComponent } from './components/external-loans/create-external-loan/create-external-loan.component';
import {FormsModule} from '@angular/forms';
import { ShowObjectTypeComponent } from './components/object-types/show-object-type/show-object-type.component';
import { SelectLoanComponent } from './components/selectors/select-loan/select-loan.component';
import { SelectStorageComponent } from './components/selectors/select-storage/select-storage.component';
import { ObjectComponent } from './components/object-types/object/object.component';
import { SelectUserComponent } from './components/selectors/select-user/select-user.component';
import { StorageLocationsComponent } from './components/storage-locations/storage-locations.component';
import { CreateStorageLocationComponent } from './components/storage-locations/create-storage-location/create-storage-location.component';
import { ShowStorageLocationComponent } from './components/storage-locations/show-storage-location/show-storage-location.component';
import { ExternalLoansComponent } from './components/external-loans/external-loans.component';
import { SelectLenderComponent } from './components/selectors/select-lender/select-lender.component';
import { SelectDatetimeComponent } from './components/selectors/select-datetime/select-datetime.component';
import { CreateLenderComponent } from './components/external-loans/create-lender/create-lender.component';
import { ViewExternalLoanComponent } from './components/external-loans/view-external-loan/view-external-loan.component';
import { QuickItemCreateComponent } from './components/quickboxes/quick-item-create/quick-item-create.component';
import { QuickmoveComponent } from './components/quickboxes/quickmove/quickmove.component';
import { ReturnsComponent } from './components/returns/returns.component';
import { TidyingComponent } from './components/tidying/tidying.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SelectObjectComponent } from './components/selectors/select-object/select-object.component';
import { QuickChangestateComponent } from './components/quickboxes/quick-changestate/quick-changestate.component';

export function tokenGetter() {
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
    SelectUserComponent,
    StorageLocationsComponent,
    CreateStorageLocationComponent,
    ShowStorageLocationComponent,
    ExternalLoansComponent,
    SelectLenderComponent,
    SelectDatetimeComponent,
    CreateLenderComponent,
    ViewExternalLoanComponent,
    QuickItemCreateComponent,
    QuickmoveComponent,
    ReturnsComponent,
    TidyingComponent,
    HomepageComponent,
    SelectObjectComponent,
    QuickChangestateComponent
  ],
  entryComponents: [
    CreateStorageLocationComponent,
    CreateLenderComponent
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
    MatNativeDateModule,

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
    MatCheckboxModule,
    MatDatepickerModule,

  ],
  providers: [
    AuthService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
