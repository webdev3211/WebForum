import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';

// import { HighlightJsModule } from 'ngx-highlight-js';

// import { HighlightModule } from 'ngx-highlightjs';
// import { HighlightOptions } from 'ngx-highlightjs';


import { FlashMessagesModule } from 'angular2-flash-messages';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';


//Services
import { AuthService } from './services/auth.service';
import { TagsService } from './services/tags.service';
import { UsersService } from './services/users.service';
import { PostService } from './services/post.service';




//Guards
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TagsComponent } from './components/tags/tags.component';
import { UsersComponent } from './components/users/users.component';
import { PostComponent } from './components/post/post.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';
import { DeletePostComponent } from './components/post/delete-post/delete-post.component';
import { SinglePostComponent } from './components/post/single-post/single-post.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ProfileComponent,
    SidebarComponent,
    TagsComponent,
    UsersComponent,
    PostComponent,
    EditPostComponent,
    DeletePostComponent,
    SinglePostComponent,
  ],
  imports: [


    MomentModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),

  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, TagsService, UsersService, PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
