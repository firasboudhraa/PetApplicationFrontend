import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './Components/home-component/home-component.component';
import { AboutComponentComponent } from './Components/about-component/about-component.component';
import { VetComponentComponent } from './Components/vet-component/vet-component.component';
import { BlogComponentComponent } from './Components/blog-component/blog-component.component';
import { PostDetailComponent } from './post-detail/post-detail.component';


const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: 'about', component: AboutComponentComponent },
  { path: 'vet', component: VetComponentComponent },
  { path: 'blog', component: BlogComponentComponent },
  { path: 'post/:id', component: PostDetailComponent },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
