import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { DonationComponent } from './Components/FrontOffice/EventDonation/donation/donation.component';
import { EventComponent } from './Components/FrontOffice/EventDonation/event/event.component';
import { EventDetailComponent } from './Components/FrontOffice/EventDonation/event-detail/event-detail.component';
import { AddDonationComponent } from './Components/FrontOffice/EventDonation/add-donation/add-donation.component';
import { AddEventComponent } from './Components/FrontOffice/EventDonation/add-event/add-event.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'donation', component:DonationComponent},
  {path:'event', component:EventComponent},
  {path:'event-detail/:id', component:EventDetailComponent},
  {path:'add-donation/:id', component:AddDonationComponent},
  {path:'add-event', component:AddEventComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
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
