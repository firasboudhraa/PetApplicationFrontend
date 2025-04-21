import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { MedicalnotebookComponent } from './medicalnotebook/medicalnotebook.component';
import { MedicalnotebookFormComponent } from './medicalnotebook-form/medicalnotebook-form.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { RecordsComponent } from './Components/BackOffice/dashboard/records/records.component';
import { StatsComponent } from './stats/stats.component';
import { AgendaComponent } from './agenda/agenda.component';
import { EditrecordComponent } from './editrecord/editrecord.component';
import { DetailComponent } from './detail/detail.component';
import { Chat } from 'openai/resources/chat';
import { ChatAIComponent } from './chat-ai/chat-ai.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'service', component:ServiceComponent},
  {path:'medicalnotebook', component:MedicalnotebookComponent},
  {path:'stats', component:StatsComponent},
  {path:'medicalnotebookform', component:MedicalnotebookFormComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  { path: 'agenda', component:AgendaComponent },
  {path :"editrecord/:id",component:EditrecordComponent},
  {path :"details/:id",component:DetailComponent},
  {path :"chat",component:ChatAIComponent},


  {path:'dashboard', component:DashboardComponent,
    children:[
      {path:'users', component:UsersComponent},
      {path:'records', component:RecordsComponent}
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
