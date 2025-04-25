import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { PostsComponent } from './Components/BackOffice/dashboard/posts/posts.component';
import { GeminiChatComponent } from './Components/FrontOffice/gemini-chat/gemini-chat.component';


import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { ServiceComponent } from './Components/FrontOffice/service/service.component';
import { AddServiceComponent } from './Components/FrontOffice/add-service/add-service.component';
import { DetailServiceComponent } from './Components/FrontOffice/detail-service/detail-service.component';
import { UserPetsComponent } from './Components/Pets/user-pets/user-pets.component';
import { PublicPetsComponent } from './Components/Pets/public-pets/public-pets.component';
import { AdoptionRequestComponent } from './Components/AdoptionRequest/adoption-request/adoption-request.component';
import { AdoptionRequestDashbordComponent } from './Components/AdoptionRequest/adoption-request-dashbord/adoption-request-dashbord.component';
import { UsersComponent } from './Components/BackOffice/dashboard/users/users.component';
import { EditAdoptionRequestComponent } from './Components/AdoptionRequest/edit-adoption-request/edit-adoption-request.component';
import { ChatPopupComponent } from './Components/chat-popup/chat-popup.component';
import { LookForASitterFormComponent } from './Components/PetSitting/look-for-asitter-form/look-for-asitter-form.component';
import { PetSittingSpaceComponent } from './Components/PetSitting/pet-sitting-space/pet-sitting-space.component';
import { DisplayOffersComponent } from './Components/PetSitting/pet-sitting-space/display-offers/display-offers.component';
import { TrackOffersComponent } from './Components/PetSitting/pet-sitting-space/track-offers/track-offers.component';

const routes: Routes = [
  { path: 'about', component: AboutComponentComponent },
  { path: 'blog', component: BlogComponentComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'add-post', component: AddPostComponent }, 

  { path: 'gemini', component: GeminiChatComponent }, // Assuming GeminiChatComponent is part of BlogComponent
  {path:'',redirectTo:'home',pathMatch:'full'},
    { path: 'modify-post/:id', component: ModifyPostComponent },
    {
      path: 'dashboard',
      component: DashboardComponent,
      children: [
        { path: 'posts', component: PostsComponent }
      ]
    },
  { path: 'home', component: HomeComponent },
  { path: 'userPets', component: UserPetsComponent },
  { path: 'publicPets', component: PublicPetsComponent },
  {path:'service', component:ServiceComponent},
  {path:'add-service',component:AddServiceComponent},
  {path:'serviceDetail/:id', component:DetailServiceComponent},
  {path:'adoptionRequestDashboard', component:AdoptionRequestDashbordComponent},
  {path:'petSittingForm', component:LookForASitterFormComponent},
  {path:'petSittingSpace', component:PetSittingSpaceComponent ,
    children:[
      {path:'display-offers', component:DisplayOffersComponent},
      {path:'track-offers', component:TrackOffersComponent},
    ] 
  },
  {path:'dashboard', component:DashboardComponent,
    children:[
      {path:'users', component:UsersComponent},
      {path:'my-pets', component:UserPetsComponent},
      {path:'adoption-request', component:AdoptionRequestDashbordComponent},
    ]
  },
  {path:'',redirectTo:'home',pathMatch:'full'},
  { path: 'adoption-request', component: AdoptionRequestComponent },
  { path: 'edit-adoption-request', component: EditAdoptionRequestComponent },
  { path: 'chat', component: ChatPopupComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
