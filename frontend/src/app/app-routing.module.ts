import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

import { LoginComponent } from './components/auth/login/login.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PostComponent } from './components/post/post.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'home', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'post/:id', canActivate: [AuthGuardService], component: PostComponent },
  { path: 'users', canActivate: [AuthGuardService], component: UsersComponent },
  { path: 'profile/:id', canActivate: [AuthGuardService], component: ProfileComponent },
  { path: 'notifs', canActivate: [AuthGuardService], component: NotificationsComponent },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
