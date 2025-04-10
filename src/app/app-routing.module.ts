import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  {path:'dashboard', component:DashboardComponent,
    children:[
      {path:'users', component:UsersComponent},
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'profile',component:UserProfileComponent}, 



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
