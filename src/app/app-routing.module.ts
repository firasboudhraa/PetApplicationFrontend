import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { LoginComponent } from './Components/FrontOffice/user/login/login.component';
import { UserProfileComponent } from './Components/FrontOffice/user/user-profile/user-profile.component';
import { RegisterComponent } from './Components/FrontOffice/user/register/register.component';
import { EditProfileComponent } from './Components/FrontOffice/user/edit-profile/edit-profile.component';
import { ActivateAccountComponent } from './Components/FrontOffice/user/activate-account/activate-account.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  {path:'',redirectTo:'home',pathMatch:'full'},

/*user routes */
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'profile',component:UserProfileComponent}, 
  {path:'profile',component:UserProfileComponent}, 
  {path : 'editProfile/:id' , component : EditProfileComponent},
  { 
    path: 'activate_account', 
    component: ActivateAccountComponent,
    data: { title: 'Account Activation' } 
  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
