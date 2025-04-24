import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule for buttons
import { MatIconModule } from '@angular/material/icon'; 
import {HttpClientModule} from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { NavbarComponent } from './Components/FrontOffice/navbar/navbar.component';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/PetService/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/PetService/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/PetService/detail-service/detail-service.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentComponent } from './Components/FrontOffice/PetService/appointment/appointment.component';
import { PetServiceService } from './Services/pet-service.service';
import { AvailableSlotsComponent } from './Components/FrontOffice/PetService/available-slots/available-slots.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { ServicesComponent } from './Components/BackOffice/dashboard/services/services.component';
import { AppointmentDashboardComponent } from './Components/FrontOffice/PetService/appointment-dashboard/appointment-dashboard.component';
import { ReceivedAppointmentComponent } from './Components/FrontOffice/PetService/appointment-dashboard/received-appointment/received-appointment.component';
import { UserAppointmentDashboardComponent } from './Components/FrontOffice/PetService/user-appointment-dashboard/user-appointment-dashboard.component';
import { SentAppointmentComponent } from './Components/FrontOffice/PetService/user-appointment-dashboard/sent-appointment/sent-appointment.component';
import { ChatPopupComponent } from './Components/FrontOffice/PetService/chat-popup/chat-popup.component';
import { DatePipe } from '@angular/common';
import { AjoutServiceComponent } from './Components/BackOffice/dashboard/ajout-service/ajout-service.component';
import { UpdateServiceComponent } from './Components/BackOffice/dashboard/update-service/update-service.component';
import { MapViewComponent } from './Components/BackOffice/dashboard/map-view/map-view.component'; 
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
    AppointmentComponent,
    AvailableSlotsComponent,
    DashboardComponent,
    UsersComponent,
    SidebarComponent,
    DashboardComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent,
    ServicesComponent,
    AppointmentDashboardComponent,
    ReceivedAppointmentComponent,
    UserAppointmentDashboardComponent,
    SentAppointmentComponent,
    ChatPopupComponent,
    AjoutServiceComponent,
    UpdateServiceComponent,
    MapViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    CarouselModule,
    BrowserAnimationsModule,
    CarouselModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatMenuModule, // Include MatMenuModule here
    MatButtonModule, // Include MatButtonModule for buttons
    MatIconModule, // Include MatIconModule for icons

  ],

  providers: [PetServiceService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
