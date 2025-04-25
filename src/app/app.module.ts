import { NgModule, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
import { DonationComponent } from './Components/FrontOffice/EventDonation/donation/donation.component';
import { AddDonationComponent } from './Components/FrontOffice/EventDonation/add-donation/add-donation.component';
import { EventComponent } from './Components/FrontOffice/EventDonation/event/event.component';
import { EventDetailComponent } from './Components/FrontOffice/EventDonation/event-detail/event-detail.component';
import { RangePipe } from './Components/FrontOffice/EventDonation/event/range.pipe';

import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { PostsComponent } from './Components/BackOffice/dashboard/posts/posts.component';
import { GeminiChatComponent } from './Components/FrontOffice/gemini-chat/gemini-chat.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { PopoverModule } from 'ngx-bootstrap/popover';



Chart.register(...registerables);
import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
import { HomeComponent } from './Components/FrontOffice/home/home.component';

import { PetCardComponent } from './Components/Pets/user-pets/pet-card/pet-card.component';
import { AddPetModalComponent } from './Components/Pets/user-pets/add-pet-modal/add-pet-modal.component';
import { PetDetailModalComponent } from './Components/Pets/user-pets/pet-detail-modal/pet-detail-modal.component';
import { EditPetModalComponent } from './Components/Pets/user-pets/edit-pet-modal/edit-pet-modal.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { PublicPetCardComponent } from './Components/Pets/public-pets/public-pet-card/public-pet-card.component';
import { PublicPetDetailModalComponent } from './Components/Pets/public-pets/public-pet-detail-modal/public-pet-detail-modal.component';
import { AdoptionRequestComponent } from './Components/AdoptionRequest/adoption-request/adoption-request.component';
import { AdoptionRequestDashbordComponent } from './Components/AdoptionRequest/adoption-request-dashbord/adoption-request-dashbord.component';
import { SentRequestComponent } from './Components/AdoptionRequest/adoption-request-dashbord/sent-request/sent-request.component';
import { ReceivedRequestComponent } from './Components/AdoptionRequest/adoption-request-dashbord/received-request/received-request.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditAdoptionRequestComponent } from './Components/AdoptionRequest/edit-adoption-request/edit-adoption-request.component';
import { ChatPopupComponent } from './Components/chat-popup/chat-popup.component';
import { LookForASitterFormComponent } from './Components/PetSitting/look-for-asitter-form/look-for-asitter-form.component';
import { PetSittingSpaceComponent } from './Components/PetSitting/pet-sitting-space/pet-sitting-space.component';
import { DisplayOffersComponent } from './Components/PetSitting/pet-sitting-space/display-offers/display-offers.component';
import { TrackOffersComponent } from './Components/PetSitting/pet-sitting-space/track-offers/track-offers.component';
import { NavbarComponent } from './Components/FrontOffice/navbar/navbar.component';


import { MedicalnotebookComponent } from './medicalnotebook/medicalnotebook.component';
import { MedicalnotebookFormComponent } from './medicalnotebook-form/medicalnotebook-form.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { RecordsComponent } from './Components/BackOffice/dashboard/records/records.component';
import { StatsComponent } from './stats/stats.component';
import { NgChartsModule } from 'ng2-charts';
import { AgendaComponent } from './agenda/agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EditrecordComponent } from './editrecord/editrecord.component';
import { DetailComponent } from './detail/detail.component';
import { RouterModule } from '@angular/router';
import { ChatAIComponent } from './chat-ai/chat-ai.component';
import { RegisterComponent } from './Components/FrontOffice/user/register/register.component';
import { UserProfileComponent } from './Components/FrontOffice/user/user-profile/user-profile.component';
import { EditProfileComponent } from './Components/FrontOffice/user/edit-profile/edit-profile.component';
import { LoginComponent } from './Components/FrontOffice/user/login/login.component';
import { UserProfileModalComponent } from './Components/FrontOffice/user/user-profile-modal/user-profile-modal.component';
import { ResetPasswordComponent } from './Components/FrontOffice/user/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './Components/FrontOffice/user/forgot-password/forgot-password.component';
import { UsersCarnetComponent } from './Components/BackOffice/dashboard/users/users-carnet/users-carnet.component';
import { EventbackComponent } from './Components/BackOffice/dashboard/eventback/eventback.component';
import { UpdateEventComponent } from './Components/BackOffice/dashboard/update-event/update-event.component';
import { AddEventComponent } from './Components/BackOffice/dashboard/add-event/add-event.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderboardComponent } from './Components/FrontOffice/EventDonation/leaderboard/leaderboard.component';
import { Nl2BrPipe } from './Components/BackOffice/dashboard/add-event/nl2br.pipe';

@NgModule({
  declarations: [
    AboutComponentComponent,
    BlogComponentComponent,
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactInfoComponent,
    PostDetailComponent,
    AddPostComponent,
    ModifyPostComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    PostsComponent,
    GeminiChatComponent,
    FooterComponent,
    HomeComponent,
    PetCardComponent,
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
    MedicalnotebookComponent,
    MedicalnotebookFormComponent,
    DonationComponent,
    AddDonationComponent,
    EventComponent,
    EventDetailComponent,
    RangePipe,
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
    RecordsComponent,
    StatsComponent,
    AgendaComponent,
    EditrecordComponent,
    DetailComponent,
    ChatAIComponent,
    /*user components*/
    RegisterComponent,
    UserProfileComponent,
    LoginComponent,
    UserProfileModalComponent,
    EditProfileComponent,
    ResetPasswordComponent ,
  ForgotPasswordComponent,
UsersComponent,
UsersCarnetComponent,
    EventbackComponent,
    UpdateEventComponent,
    AddEventComponent,
    LeaderboardComponent,
    Nl2BrPipe
  ],
  imports: [
    BrowserAnimationsModule,  
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PickerModule,
    MatSnackBarModule,
    PopoverModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgChartsModule ,
    FullCalendarModule, 

    BrowserAnimationsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
