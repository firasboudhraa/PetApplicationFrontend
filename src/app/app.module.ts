import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { NavbarComponent } from './Components/FrontOffice/navbar/navbar.component';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { RegisterComponent } from './Components/FrontOffice/user/register/register.component';
import { UserProfileComponent } from './Components/FrontOffice/user/user-profile/user-profile.component';
import { LoginComponent } from './Components/FrontOffice/user/login/login.component';
import { AuthInterceptor } from './Components/FrontOffice/user/auth/jwt.interceptor';
import { UserProfileModalComponent } from './Components/FrontOffice/user/user-profile-modal/user-profile-modal.component';
import { EditProfileComponent } from './Components/FrontOffice/user/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './Components/FrontOffice/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/FrontOffice/user/reset-password/reset-password.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactInfoComponent,
    FooterComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    // User components
    RegisterComponent,
    UserProfileComponent,
    LoginComponent,
    UserProfileModalComponent,
    EditProfileComponent,
    ResetPasswordComponent ,
  ForgotPasswordComponent,
UsersComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }