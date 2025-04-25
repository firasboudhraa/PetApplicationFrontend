import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/FrontOffice/home/home.component';
import { MarketplaceComponent } from './Components/FrontOffice/marketplace/marketplace.component';
import { ProduitComponent } from './Components/FrontOffice/produit/produit.component';
import { FormulaireProduitComponent } from './Components/FrontOffice/formulaire-produit/formulaire-produit.component';
import { EditProductComponent } from './Components/FrontOffice/edit-product/edit-product.component';
import { ProdDetailComponent } from './Components/FrontOffice/prod-detail/prod-detail.component';
import { PaymentComponent } from './Components/FrontOffice/form-payment/form-payment.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { MarketplaceBackComponent } from './Components/BackOffice/marketplace-back/marketplace-back.component';
import { BasketBackComponent } from './Components/BackOffice/basket-back/basket-back.component';
import { PaymentBackComponent } from './Components/BackOffice/payment-back/payment-back.component';
import { ProductBackComponent } from './Components/BackOffice/product-back/product-back.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'produit', component: ProduitComponent },
  { path: 'formproduit', component: FormulaireProduitComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'product/:id', component: ProdDetailComponent },
  {path:'dashboard',component:DashboardComponent , children: [
    { path: 'marketplaces', component: MarketplaceBackComponent },
    { path: 'baskets', component: BasketBackComponent },  
    { path: 'payments', component: PaymentBackComponent },
    { path: 'products', component: ProductBackComponent },


  ]},
  {path:'',redirectTo:'home',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
