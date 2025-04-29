  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
  import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { CarouselModule } from 'ngx-owl-carousel-o';
  import { MatMenuModule } from '@angular/material/menu'; 
  import { HttpClientModule } from '@angular/common/http';
  import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
  import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
  import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
  import { DonationComponent } from './Components/FrontOffice/EventDonation/donation/donation.component';
  import { AddDonationComponent } from './Components/FrontOffice/EventDonation/add-donation/add-donation.component';
  import { EventComponent } from './Components/FrontOffice/EventDonation/event/event.component';
  import { EventDetailComponent } from './Components/FrontOffice/EventDonation/event-detail/event-detail.component';
  import { RangePipe } from './Components/FrontOffice/EventDonation/event/range.pipe';

  import { NgxPaginationModule } from 'ngx-pagination';
  import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
  import { ServiceComponent } from './Components/FrontOffice/PetService/service/service.component';
  import { AddServiceComponent } from './Components/FrontOffice/PetService/add-service/add-service.component';
  import { DetailServiceComponent } from './Components/FrontOffice/PetService/detail-service/detail-service.component';
  import { AppointmentComponent } from './Components/FrontOffice/PetService/appointment/appointment.component';
  import { PetServiceService } from './Services/pet-service.service';
  import { AvailableSlotsComponent } from './Components/FrontOffice/PetService/available-slots/available-slots.component';
  import { PostsComponent } from './Components/BackOffice/dashboard/posts/posts.component';
  import { GeminiChatComponent } from './Components/FrontOffice/gemini-chat/gemini-chat.component';
  import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
  import { PickerModule } from '@ctrl/ngx-emoji-mart'; // Use only this if needed

  import { MatSnackBarModule } from '@angular/material/snack-bar';
  import { BaseChartDirective } from 'ng2-charts';
  import { Chart, registerables } from 'chart.js';
  import { PopoverModule } from 'ngx-bootstrap/popover';
  import { HTTP_INTERCEPTORS } from '@angular/common/http';

  Chart.register(...registerables);
  import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
  import { HomeComponent } from './Components/FrontOffice/home/home.component';
  import { MarketplaceComponent } from './Components/FrontOffice/marketplace/marketplace.component';
  import { ProduitComponent } from './Components/FrontOffice/produit/produit.component';
  import { FormulaireProduitComponent } from './Components/FrontOffice/formulaire-produit/formulaire-produit.component';
  import { BasketComponent } from './Components/FrontOffice/basket/basket.component';
  import { EditProductComponent } from './Components/FrontOffice/edit-product/edit-product.component';
  import { ProdDetailComponent } from './Components/FrontOffice/prod-detail/prod-detail.component';
  import { PaymentComponent } from './Components/FrontOffice/form-payment/form-payment.component';
  import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
  import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
  import { HeaderComponent } from './Components/BackOffice/header/header.component';
  import { MarketplaceBackComponent } from './Components/BackOffice/marketplace-back/marketplace-back.component';
  import { BasketBackComponent } from './Components/BackOffice/basket-back/basket-back.component';
  import { PaymentBackComponent } from './Components/BackOffice/payment-back/payment-back.component';
  import { ProductBackComponent } from './Components/BackOffice/product-back/product-back.component';

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
import { Nl2BrPipe } from './Components/BackOffice/dashboard/add-event/nl2br.pipe';
import { AuthInterceptor } from './Components/FrontOffice/user/auth/jwt.interceptor';
import { ActivateAccountComponent } from './Components/FrontOffice/user/activate-account/activate-account.component';
import { ToastrModule } from 'ngx-toastr';

  import { ServicesComponent } from './Components/BackOffice/dashboard/services/services.component';
  import { AppointmentDashboardComponent } from './Components/FrontOffice/PetService/appointment-dashboard/appointment-dashboard.component';
  import { ReceivedAppointmentComponent } from './Components/FrontOffice/PetService/appointment-dashboard/received-appointment/received-appointment.component';
  import { UserAppointmentDashboardComponent } from './Components/FrontOffice/PetService/user-appointment-dashboard/user-appointment-dashboard.component';
  import { SentAppointmentComponent } from './Components/FrontOffice/PetService/user-appointment-dashboard/sent-appointment/sent-appointment.component';
  import { DatePipe } from '@angular/common';
  import { AjoutServiceComponent } from './Components/BackOffice/dashboard/ajout-service/ajout-service.component';
  import { UpdateServiceComponent } from './Components/BackOffice/dashboard/update-service/update-service.component';
  import { MapViewComponent } from './Components/BackOffice/dashboard/map-view/map-view.component'; 
  import { ChatPopupComponent } from './Components/FrontOffice/PetService/chat-popup/chat-popup.component';
  import { ServiceProfileDashboardComponent } from './Components/BackOffice/service-profile/service-profile-dashboard/service-profile-dashboard.component';
  import { HeaderProfileComponent } from './Components/BackOffice/service-profile/header-profile/header-profile.component';
  import { SidebarProfileComponent } from './Components/BackOffice/service-profile/sidebar-profile/sidebar-profile.component';
  import { AddServiceProfileComponent } from './Components/BackOffice/service-profile/add-service-profile/add-service-profile.component';
  import { AppointmentsProfileComponent } from './Components/BackOffice/service-profile/appointments-profile/appointments-profile.component';
  import { StatsProfileComponent } from './Components/BackOffice/service-profile/stats-profile/stats-profile.component';
import { MatchingPetComponent } from './Components/Pets/Matching/matching-pet/matching-pet.component';
import { MatchingDetailModalComponent } from './Components/Pets/Matching/matching-detail-modal/matching-detail-modal.component';
import { ProfileComponent } from './Components/FrontOffice/user/profile/profile.component';
import { SideBarUserComponent } from './Components/FrontOffice/user/side-bar-user/side-bar-user.component';

import { ServiceDetailModalComponent } from './Components/FrontOffice/PetService/service/service-detail-modal/service-detail-modal.component';
import { MadebymeComponent } from './Components/PetSitting/pet-sitting-space/madebyme/madebyme.component';
import { ContactComponent } from './Components/FrontOffice/contact/contact.component';
import { UpdateServiceProfileComponent } from './Components/BackOffice/service-profile/update-service-profile/update-service-profile.component';
import { AppointmentsProfileUserComponent } from './Components/FrontOffice/user/appointments-profile-user/appointments-profile-user.component';
import { MyproductsComponent } from './Components/FrontOffice/user/myproducts/myproducts.component';

  @NgModule({
    declarations: [
      AboutComponentComponent,
      BlogComponentComponent,
      AppComponent,
      PublicPetCardComponent,
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
      RegisterComponent,
      LoginComponent,
      UserProfileModalComponent,
      EditProfileComponent,
      ResetPasswordComponent,
      ForgotPasswordComponent,
      UsersCarnetComponent,
      EventbackComponent,
      UpdateEventComponent,
      AddEventComponent,
      Nl2BrPipe,
      ActivateAccountComponent,
      ServiceComponent,
      AddServiceComponent,
      DetailServiceComponent,
      AppointmentComponent,
      AvailableSlotsComponent,
      ServicesComponent,
      AppointmentDashboardComponent,
      ReceivedAppointmentComponent,
      UserAppointmentDashboardComponent,
      SentAppointmentComponent,
      AjoutServiceComponent,
      UpdateServiceComponent,
      MapViewComponent,
      MarketplaceComponent,
      ProduitComponent,
      FormulaireProduitComponent,
      BasketComponent,
      EditProductComponent,
      ProdDetailComponent,
      PaymentComponent,
      MarketplaceBackComponent,
      BasketBackComponent,
      PaymentBackComponent,
      ProductBackComponent,
      ServiceProfileDashboardComponent,
      HeaderProfileComponent,
      SidebarProfileComponent,
      AddServiceProfileComponent,
      AppointmentsProfileComponent,
      StatsProfileComponent,
      MatchingPetComponent,
      MatchingDetailModalComponent,
      ServiceDetailModalComponent, 
      SideBarUserComponent,
      ProfileComponent,
      UsersComponent,
      MadebymeComponent,
      ContactComponent,
      UpdateServiceProfileComponent,
      AppointmentsProfileUserComponent,
      MyproductsComponent
    ],
    imports: [
      BrowserAnimationsModule,
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      PickerModule,
      ReactiveFormsModule,
      HttpClientModule,
      EmojiModule, 
      MatSnackBarModule,
      PopoverModule.forRoot(),
      NgChartsModule,
      FullCalendarModule,
      ToastrModule.forRoot(),
      CarouselModule,
      NgxPaginationModule,
      MatTooltipModule,
      MatMenuModule,
      MatButtonModule,
      MatIconModule,
      RouterModule,

      
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      PetServiceService,
      DatePipe
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
