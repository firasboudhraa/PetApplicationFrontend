import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {HttpClientModule} from '@angular/common/http';
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
  ],

  providers: [PetServiceService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
