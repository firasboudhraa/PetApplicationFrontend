import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponentComponent } from './Components/FrontOffice/about-component/about-component.component';
import { BlogComponentComponent } from './Components/FrontOffice/blog-component/blog-component.component';
import { HomeComponentComponent } from './Components/home-component/home-component.component';
import { VetComponentComponent } from './Components/vet-component/vet-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponentComponent } from './Components/FrontOffice/footer/footer-component.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ContactInfoComponent } from './Components/FrontOffice/contact-info/contact-info.component';
import { PostDetailComponent } from './Components/FrontOffice/post-detail/post-detail.component';
import { AddPostComponent } from './Components/FrontOffice/add-post/add-post.component';
import { ModifyPostComponent } from './Components/FrontOffice/modify-post/modify-post.component';
import { DashboardComponent } from './Components/BackOffice/dashboard/dashboard.component';
import { HeaderComponent } from './Components/BackOffice/header/header.component';
import { SidebarComponent } from './Components/BackOffice/sidebar/sidebar.component';
import { PostsComponent } from './Components/BackOffice/dashboard/posts/posts.component';
import { GeminiChatComponent } from './Components/FrontOffice/gemini-chat/gemini-chat.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentService } from './services/comments.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);


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
    ModifyPostComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    PostsComponent,
    GeminiChatComponent,

  ],
  imports: [
    BrowserAnimationsModule,  
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PickerModule,
    MatSnackBarModule,
    BaseChartDirective


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
