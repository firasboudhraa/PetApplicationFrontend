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
import { DonationComponent } from './Components/FrontOffice/EventDonation/donation/donation.component';
import { AddDonationComponent } from './Components/FrontOffice/EventDonation/add-donation/add-donation.component';
import { EventComponent } from './Components/FrontOffice/EventDonation/event/event.component';
import { EventDetailComponent } from './Components/FrontOffice/EventDonation/event-detail/event-detail.component';
import { RangePipe } from './Components/FrontOffice/EventDonation/event/range.pipe';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { EventbackComponent } from './Components/BackOffice/dashboard/eventback/eventback.component';
import { UpdateEventComponent } from './Components/BackOffice/dashboard/update-event/update-event.component';
import { AddEventComponent } from './Components/BackOffice/dashboard/add-event/add-event.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderboardComponent } from './Components/FrontOffice/EventDonation/leaderboard/leaderboard.component';
import { Nl2BrPipe } from './Components/BackOffice/dashboard/add-event/nl2br.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactInfoComponent,
    FooterComponent,
    HomeComponent,
    DonationComponent,
    AddDonationComponent,
    EventComponent,
    EventDetailComponent,
    RangePipe,
    ServiceComponent,
    AddServiceComponent,
    DetailServiceComponent,
    DashboardComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent,
    EventbackComponent,
    UpdateEventComponent,
    AddEventComponent,
    LeaderboardComponent,
    Nl2BrPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
