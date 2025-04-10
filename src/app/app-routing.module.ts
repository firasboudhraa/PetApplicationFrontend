import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'dashboard', component:DashboardComponent,
    children:[
      {path:'users', component:UsersComponent},
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
