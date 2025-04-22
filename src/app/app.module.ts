import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { PetCardComponent } from './Components/Pets/user-pets/pet-card/pet-card.component';
import { AddPetModalComponent } from './Components/Pets/user-pets/add-pet-modal/add-pet-modal.component';
import { PetDetailModalComponent } from './Components/Pets/user-pets/pet-detail-modal/pet-detail-modal.component';
import { EditPetModalComponent } from './Components/Pets/user-pets/edit-pet-modal/edit-pet-modal.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { PublicPetCardComponent } from './Components/Pets/public-pets/public-pet-card/public-pet-card.component';
import { PublicPetDetailModalComponent } from 'src/app/Components/Pets/public-pets/public-pet-detail-modal/public-pet-detail-modal.component';
import { AdoptionRequestComponent } from './Components/AdoptionRequest/adoption-request/adoption-request.component';
import { AdoptionRequestDashbordComponent } from './Components/AdoptionRequest/adoption-request-dashbord/adoption-request-dashbord.component';
import { SentRequestComponent } from './Components/AdoptionRequest/adoption-request-dashbord/sent-request/sent-request.component';
import { ReceivedRequestComponent } from './Components/AdoptionRequest/adoption-request-dashbord/received-request/received-request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditAdoptionRequestComponent } from './Components/AdoptionRequest/edit-adoption-request/edit-adoption-request.component';
import { ChatPopupComponent } from './Components/chat-popup/chat-popup.component';
import { LookForASitterFormComponent } from './Components/PetSitting/look-for-asitter-form/look-for-asitter-form.component';
import { PetSittingSpaceComponent } from './Components/PetSitting/pet-sitting-space/pet-sitting-space.component';
import { DisplayOffersComponent } from './Components/PetSitting/pet-sitting-space/display-offers/display-offers.component';
import { TrackOffersComponent } from './Components/PetSitting/pet-sitting-space/track-offers/track-offers.component';


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
    PetCardComponent,
    AddServiceComponent,
    DetailServiceComponent,
    ServiceComponent,
    AddPetModalComponent,
    PetDetailModalComponent,
    EditPetModalComponent,
    UserPetsComponent,
    PublicPetsComponent,
    PublicPetCardComponent,
    PublicPetDetailModalComponent,
    AdoptionRequestComponent,
    AdoptionRequestDashbordComponent,
    SentRequestComponent,
    ReceivedRequestComponent,
    DashboardComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent,
    EditAdoptionRequestComponent,
    ChatPopupComponent,
    LookForASitterFormComponent,
    PetSittingSpaceComponent,
    DisplayOffersComponent,
    TrackOffersComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule



  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
