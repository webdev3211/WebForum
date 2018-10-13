//Angular modules
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

//user modules

import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';


import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { TagsComponent } from './components/tags/tags.component';
import { UsersComponent } from './components/users/users.component';
import { PostComponent } from './components/post/post.component';
import { SinglePostComponent } from './components/post/single-post/single-post.component';
import { DeletePostComponent } from './components/post/delete-post/delete-post.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';
import { DevelopersComponent } from './components/developers/developers.component';
import { NotfoundComponent } from './components/notfound/notfound.component';



const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'tags',
        component: TagsComponent

    },
    {
        path: 'users',
        component: UsersComponent

    },
    {
        path: 'posts',
        component: PostComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'singlePost/:id',
        component: SinglePostComponent
    },
    {
        path: 'edit-post/:id',
        component: EditPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'delete-post',
        component: DeletePostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'developers',
        component: DevelopersComponent,
    },
    {
        path: '*',
        component: HomeComponent
    }


];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }
