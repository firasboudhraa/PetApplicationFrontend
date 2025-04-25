import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponent } from './Components/FrontOffice/footer/footer.component';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { NavbarComponent } from './Components/FrontOffice/navbar/navbar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContactInfoComponent,
    FooterComponent,
    HomeComponent,
    MarketplaceComponent,
    ProduitComponent,
    FormulaireProduitComponent,
    BasketComponent,
    EditProductComponent,
    ProdDetailComponent,
    PaymentComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    MarketplaceBackComponent,
    BasketBackComponent,
    PaymentBackComponent,
    ProductBackComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
