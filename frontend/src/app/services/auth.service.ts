import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { MessagesService } from './messages.service';
import { NotificationsService } from './notifications.service';

import { User } from '../interfaces/User.interface';
import { HttpResponse } from '../interfaces/HttpResponse.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;
  private userUrl = `${environment.backendServer}/api/user`;


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
  public loginUser(email: string, password: string): void {
    this.httpClient.post(`${this.userUrl}/login`, {email, password}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }))
      .subscribe((response: HttpResponse): void => {
        if (response.status === 200) {
          this.user = response.body;
          this.messagesService.add(`Bienvenue ${this.user.name} !`);
          this.router.navigate(['/home']);
          this.notificationService.getNotifications();
        } else {
          this.log(`Erreur lors du Login: ${response.error.error}`);
        }
      });
  }

  public logoutUser(): void {
    this.httpClient.get(`${this.userUrl}/logout`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }))
      .subscribe((response: HttpResponse): void => {
        if (response.status === 200) {
          this.user = undefined;
          this.log(`Vous êtes déconnecté`);
          this.router.navigate(['/login']);
        } else {
          this.log(`Erreur: Une erreur s'est produite!`);
        }
      });
  }

  public getCurrentUserInfo(): void {
    this.httpClient.get(`${this.userUrl}/currentuser`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Veuillez vous identifier`);
        return of(err);
      }))
      .subscribe((response: HttpResponse) => {
        if (response.status === 200) {
          this.user = response.body;
          this.notificationService.getNotifications();
        } else {
          this.log(`Erreur: Une erreur s'est produite!`);
        }
      });
  }

  public createNewUser(name: string, email: string, password: string): Observable<HttpResponse> {
    return this.httpClient.post(`${this.userUrl}/new`, {name, email, password}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }));
  }
}
