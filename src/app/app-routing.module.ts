import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { PetCardComponent } from './Components/Pets/pet-card/pet-card.component';
import { ShowPetsComponent } from './Components/Pets/show-pets/show-pets.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'pets', component: ShowPetsComponent },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
