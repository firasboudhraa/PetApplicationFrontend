import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { NavbarComponent } from './Components/FrontOffice/navbar/navbar.component';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { MedicalnotebookComponent } from './medicalnotebook/medicalnotebook.component';
import { MedicalnotebookFormComponent } from './medicalnotebook-form/medicalnotebook-form.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { RecordsComponent } from './Components/BackOffice/dashboard/records/records.component';
import { StatsComponent } from './stats/stats.component';
import { NgChartsModule } from 'ng2-charts';
import { AgendaComponent } from './agenda/agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EditrecordComponent } from './editrecord/editrecord.component';
import { DetailComponent } from './detail/detail.component';
import { RouterModule } from '@angular/router';
import { ChatAIComponent } from './chat-ai/chat-ai.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactInfoComponent,
    FooterComponent,
    HomeComponent,
    ServiceComponent,
    AddServiceComponent,
    DetailServiceComponent,
    MedicalnotebookComponent,
    MedicalnotebookFormComponent,
    DashboardComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent,
    RecordsComponent,
    StatsComponent,
    AgendaComponent,
    EditrecordComponent,
    DetailComponent,
    ChatAIComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule ,
    FullCalendarModule, 

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
