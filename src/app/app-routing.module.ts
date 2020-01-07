import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginFailedComponent} from './components/accounts/login-failed/login-failed.component';
import {RequireLoginComponent} from './components/accounts/require-login/require-login.component';
import {PermissionAuthGuard} from './services/permission-auth-guard.service';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ObjectTypesComponent} from './components/object-types/object-types.component';
import {CreateObjectTypeComponent} from './components/create-object-type/create-object-type.component';
import {CreateExternalLoanComponent} from './components/create-external-loan/create-external-loan.component';
import {ShowObjectTypeComponent} from './components/show-object-type/show-object-type.component';


const routes: Routes = [
  {path: 'require-login', component: RequireLoginComponent},
  {path: 'login-failed', component: LoginFailedComponent},
  {path: 'login-failed/:details', component: LoginFailedComponent},

  // Protected paths

  {path: 'object-types', component: ObjectTypesComponent, canActivate: [PermissionAuthGuard]},
  {path: 'object-types/create', component: CreateObjectTypeComponent, canActivate: [PermissionAuthGuard]},
  {path: 'object-types/:typeId', component: ShowObjectTypeComponent, canActivate: [PermissionAuthGuard]},
  {path: 'object-types/edit/:typeId', component: CreateObjectTypeComponent, canActivate: [PermissionAuthGuard]},
  {path: 'external-loans', component: ObjectTypesComponent, canActivate: [PermissionAuthGuard]},
  {path: 'external-loans/create', component: CreateExternalLoanComponent, canActivate: [PermissionAuthGuard]},
  {
    path: '**',
    canActivate: [PermissionAuthGuard],
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

