import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { LoginComponent } from './Components/FrontOffice/user/login/login.component';
import { RegisterComponent } from './Components/FrontOffice/user/register/register.component';
import { UserProfileComponent } from './Components/FrontOffice/user/user-profile/user-profile.component';
import { EditProfileComponent } from './Components/FrontOffice/user/edit-profile/edit-profile.component';
import { AuthGuard } from './Components/FrontOffice/user/auth/auth.guard';
import { UserProfileModalComponent } from './Components/FrontOffice/user/user-profile-modal/user-profile-modal.component';
import { ForgotPasswordComponent } from './Components/FrontOffice/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/FrontOffice/user/reset-password/reset-password.component';
import { ActivateAccountComponent } from './Components/FrontOffice/user/activate-account/activate-account.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'dashboard', component:DashboardComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true },
    children:[
      {path:'users', component:UsersComponent},
    ]
  },

  {path:'',redirectTo:'home',pathMatch:'full'},
  /*user routes */
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'profile',component:UserProfileComponent}, 
  {path : 'editProfile/:id' , component : EditProfileComponent},
  {path : 'prefModal/:id' , component : UserProfileModalComponent},
  {path : 'forgot-password' , component :ForgotPasswordComponent},
  {path : 'reset-password' , component :ResetPasswordComponent},



  { 
    path: 'activate_account', 
    component: ActivateAccountComponent,
    data: { title: 'Account Activation' } 
  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },


  { 
    path: 'admin', 
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true }  
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
