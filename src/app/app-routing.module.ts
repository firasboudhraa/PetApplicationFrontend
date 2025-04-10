import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './Components/home-component/home-component.component';
import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
import { VetComponentComponent } from './Components/vet-component/vet-component.component';
import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: 'about', component: AboutComponentComponent },
  { path: 'vet', component: VetComponentComponent },
  { path: 'blog', component: BlogComponentComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'add-post', component: AddPostComponent }, 
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'dashboard',component:DashboardComponent},
    { path: 'modify-post/:id', component: ModifyPostComponent },  // Add route for modifying post


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
