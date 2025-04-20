import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { MarketplaceComponent } from './Components/FrontOffice/marketplace/marketplace.component';
import { ProduitComponent } from './Components/FrontOffice/produit/produit.component';
import { FormulaireProduitComponent } from './Components/FrontOffice/formulaire-produit/formulaire-produit.component';
import { EditProductComponent } from './Components/FrontOffice/edit-product/edit-product.component';
import { FormPaymentComponent } from './Components/FrontOffice/form-payment/form-payment.component';
import { ProdDetailComponent } from './Components/FrontOffice/prod-detail/prod-detail.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'produit', component: ProduitComponent },
  { path: 'formproduit', component: FormulaireProduitComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'payment', component: FormPaymentComponent },
  { path: 'product/:id', component: ProdDetailComponent },
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
