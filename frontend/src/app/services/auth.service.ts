import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessagesService } from "./messages.service";
import { NotificationsService } from "./notifications.service";

import { User } from "../interfaces/User.interface";
import { HttpResponse } from "../interfaces/HttpResponse.interface";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  private userUrl = 'http://localhost:3000/api/user';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
    private router: Router,
    private notificationService: NotificationsService
  ) { }

  /** Log a message with the MessageService */
  private log(message: string): void {
    this.messagesService.add(`Authentification: ${message}`);
  }

  /**
   * Loggin un utilisateur
   * @param email email de l'utilisateur
   * @param password mot de passe de l'utilisateur
   */
  loginUser(email: string, password: string) {
    return this.httpClient.post(`${this.userUrl}/login`, {email, password}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }))
      .subscribe((response: HttpResponse): void => {
        if (response.status === 200) {
          this.user = response.body;
          if (response.body.pictureUrl === null) {
            this.user.pictureUrl = "./assets/anonymousUser.svg"
          }
          this.messagesService.add(`Bienvenue ${this.user.name} !`);
          this.router.navigate(['/home']);
          this.notificationService.getNotifications();
        } else {
          this.log(`Erreur lors du Login: ${response.error.error}`);
        }
      });
  }

  logoutUser() {
    return this.httpClient.get(`${this.userUrl}/logout`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }))
      .subscribe((response: HttpResponse): void => {
        if (response.status === 200) {
          this.user = undefined;
          this.log(`Vous êtes déconnecté`);
          this.router.navigate(['/login']);
        } else {
          this.log(`Erreur: Une erreur s'est produite!`)
        }
      })
  }

  getCurrentUserInfo() {
    return this.httpClient.get(`${this.userUrl}/currentuser`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Veuillez vous identifier`);
        return of(err);
      }))
      .subscribe((data: User) => {
        if (data.userId) {
          this.user = data;
          if (data.pictureUrl === null) {
            this.user.pictureUrl = "./assets/anonymousUser.svg"
          }
        }
      })
  }

  createNewUser(name: string, email: string, password: string) {
    return this.httpClient.post(`${this.userUrl}/new`, {name, email, password}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }))
  }  
}
