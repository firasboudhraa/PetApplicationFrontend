import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponentComponent } from './Components/about-component/about-component.component';
import { BlogComponentComponent } from './Components/blog-component/blog-component.component';
import { HomeComponentComponent } from './Components/home-component/home-component.component';
import { VetComponentComponent } from './Components/vet-component/vet-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponentComponent } from './Components/footer-component/footer-component.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ContactInfoComponent } from './Components/contact-info/contact-info.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AddPostComponent } from './add-post/add-post.component';
import { ModifyPostComponent } from './modify-post/modify-post.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponentComponent,
    BlogComponentComponent,
    HomeComponentComponent,
    VetComponentComponent,
    FooterComponentComponent,
    NavbarComponent,
    ContactInfoComponent,
    PostDetailComponent,
    AddPostComponent,
    ModifyPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
