import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { AdoptionRequestComponent } from './Components/AdoptionRequest/adoption-request/adoption-request.component';
import { AdoptionRequestDashbordComponent } from './Components/AdoptionRequest/adoption-request-dashbord/adoption-request-dashbord.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { EditAdoptionRequestComponent } from './Components/AdoptionRequest/edit-adoption-request/edit-adoption-request.component';

  
  const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'userPets', component: UserPetsComponent },
  { path: 'publicPets', component: PublicPetsComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  {path:'adoptionRequestDashboard', component:AdoptionRequestDashbordComponent},
  {path:'dashboard', component:DashboardComponent,
    children:[
      {path:'users', component:UsersComponent},
      {path:'my-pets', component:UserPetsComponent},
      {path:'adoption-request', component:AdoptionRequestDashbordComponent},
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},
  { path: 'adoption-request', component: AdoptionRequestComponent },
  { path: 'edit-adoption-request', component: EditAdoptionRequestComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
