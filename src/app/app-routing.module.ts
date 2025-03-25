import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './Components/home-component/home-component.component';
import { AboutComponentComponent } from './Components/about-component/about-component.component';
import { VetComponentComponent } from './Components/vet-component/vet-component.component';


const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: 'about', component: AboutComponentComponent },
  { path: 'vet', component: VetComponentComponent },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
