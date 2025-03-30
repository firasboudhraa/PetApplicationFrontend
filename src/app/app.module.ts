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
import { PetCardComponent } from './Components/Pets/pet-card/pet-card.component';
import { ShowPetsComponent } from './Components/Pets/show-pets/show-pets.component';
import { AddPetModalComponent } from './Components/Pets/user-pets/add-pet-modal/add-pet-modal.component';
import { PetDetailModalComponent } from './Components/Pets/user-pets/pet-detail-modal/pet-detail-modal.component';
import { EditPetModalComponent } from './Components/Pets/user-pets/edit-pet-modal/edit-pet-modal.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { PublicPetCardComponent } from './Components/Pets/public-pets/public-pet-card/public-pet-card.component';
import { PublicPetDetailModalComponent } from 'src/app/Components/Pets/public-pets/public-pet-detail-modal/public-pet-detail-modal.component';

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
    ShowPetsComponent,
    AddServiceComponent,
    DetailServiceComponent,
    ServiceComponent,
    AddPetModalComponent,
    PetDetailModalComponent,
    EditPetModalComponent,
    UserPetsComponent,
    PublicPetsComponent,
    PublicPetCardComponent,
    PublicPetDetailModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
