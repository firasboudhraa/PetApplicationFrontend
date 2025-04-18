import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/PetService/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/PetService/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/PetService/detail-service/detail-service.component';
import { AppointmentComponent } from './Components/FrontOffice/PetService/appointment/appointment.component';
import { AvailableSlotsComponent } from './Components/FrontOffice/PetService/available-slots/available-slots.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { ServicesComponent } from './Components/BackOffice/dashboard/services/services.component';
import { ModifyServiceComponent } from './Components/FrontOffice/PetService/modify-service/modify-service.component';
import { AppointmentDashboardComponent } from './Components/FrontOffice/PetService/appointment-dashboard/appointment-dashboard.component';
import { UserAppointmentDashboardComponent } from './Components/FrontOffice/PetService/user-appointment-dashboard/user-appointment-dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'update-service/:id',component:ModifyServiceComponent},
  {path:'full-calendar/:id',component:AvailableSlotsComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  {path:'appointment-Dashboard',component:AppointmentDashboardComponent},
  {path:'user-appointment-dashboard',component:UserAppointmentDashboardComponent},
  {path:'appointment/:id',component:AppointmentComponent},
  {path:'dashboard',component:DashboardComponent,
    children:[
     {path:'users',component:UsersComponent},
     {path:'services',component:ServicesComponent},
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
