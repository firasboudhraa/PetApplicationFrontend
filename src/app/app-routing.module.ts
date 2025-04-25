import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
import { PostsComponent } from './Components/BackOffice/dashboard/posts/posts.component';
import { GeminiChatComponent } from './Components/FrontOffice/gemini-chat/gemini-chat.component';

import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { AdoptionRequestComponent } from './Components/AdoptionRequest/adoption-request/adoption-request.component';
import { AdoptionRequestDashbordComponent } from './Components/AdoptionRequest/adoption-request-dashbord/adoption-request-dashbord.component';
import { EditAdoptionRequestComponent } from './Components/AdoptionRequest/edit-adoption-request/edit-adoption-request.component';
import { ChatPopupComponent } from './Components/chat-popup/chat-popup.component';
import { LookForASitterFormComponent } from './Components/PetSitting/look-for-asitter-form/look-for-asitter-form.component';
import { PetSittingSpaceComponent } from './Components/PetSitting/pet-sitting-space/pet-sitting-space.component';
import { DisplayOffersComponent } from './Components/PetSitting/pet-sitting-space/display-offers/display-offers.component';
import { TrackOffersComponent } from './Components/PetSitting/pet-sitting-space/track-offers/track-offers.component';
import { MedicalnotebookComponent } from './medicalnotebook/medicalnotebook.component';
import { MedicalnotebookFormComponent } from './medicalnotebook-form/medicalnotebook-form.component';
import { RecordsComponent } from './Components/BackOffice/dashboard/records/records.component';
import { StatsComponent } from './stats/stats.component';
import { AgendaComponent } from './agenda/agenda.component';
import { EditrecordComponent } from './editrecord/editrecord.component';
import { DetailComponent } from './detail/detail.component';
import { Chat } from 'openai/resources/chat';
import { ChatAIComponent } from './chat-ai/chat-ai.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { LoginComponent } from './Components/FrontOffice/user/login/login.component';
import { RegisterComponent } from './Components/FrontOffice/user/register/register.component';
import { UserProfileComponent } from './Components/FrontOffice/user/user-profile/user-profile.component';
import { EditProfileComponent } from './Components/FrontOffice/user/edit-profile/edit-profile.component';
import { AuthGuard } from './Components/FrontOffice/user/auth/auth.guard';
import { UserProfileModalComponent } from './Components/FrontOffice/user/user-profile-modal/user-profile-modal.component';
import { ForgotPasswordComponent } from './Components/FrontOffice/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/FrontOffice/user/reset-password/reset-password.component';
import { ActivateAccountComponent } from './Components/FrontOffice/user/activate-account/activate-account.component';
import { UsersCarnetComponent } from './Components/BackOffice/dashboard/users/users-carnet/users-carnet.component';

const routes: Routes = [
  { path: 'about', component: AboutComponentComponent },
  { path: 'blog', component: BlogComponentComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'add-post', component: AddPostComponent },

  { path: 'gemini', component: GeminiChatComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'modify-post/:id', component: ModifyPostComponent },
  { path: 'home', component: HomeComponent },
  { path: 'userPets', component: UserPetsComponent },
  { path: 'publicPets', component: PublicPetsComponent },
  { path: 'medicalnotebook', component: MedicalnotebookComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'medicalnotebookform', component: MedicalnotebookFormComponent },

  {
    path: 'adoptionRequestDashboard',
    component: AdoptionRequestDashbordComponent,
  },
  { path: 'petSittingForm', component: LookForASitterFormComponent },
  {
    path: 'petSittingSpace',
    component: PetSittingSpaceComponent,
    children: [
      { path: 'display-offers', component: DisplayOffersComponent },
      { path: 'track-offers', component: TrackOffersComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'my-pets', component: UserPetsComponent },
      { path: 'adoption-request', component: AdoptionRequestDashbordComponent },
      { path: 'records', component: RecordsComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'carnets', component: UsersCarnetComponent }
    ],
  },
  { path: 'agenda', component: AgendaComponent },
  { path: 'editrecord/:id', component: EditrecordComponent },
  { path: 'details/:id', component: DetailComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'adoption-request', component: AdoptionRequestComponent },
  { path: 'edit-adoption-request', component: EditAdoptionRequestComponent },
  { path: 'chat', component: ChatPopupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true },
    children: [{ path: 'users', component: UsersComponent }],
  },

  /*user routes */
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'editProfile/:id', component: EditProfileComponent },
  { path: 'prefModal/:id', component: UserProfileModalComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: 'activate_account',
    component: ActivateAccountComponent,
    data: { title: 'Account Activation' },
  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'admin',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { adminOnly: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
