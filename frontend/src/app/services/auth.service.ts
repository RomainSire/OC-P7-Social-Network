import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessagesService } from "./messages.service";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  private userUrl = 'http://localhost:3000/api/user';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
    private router: Router
  ) { }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messagesService.add(`AuthService: ${message}`);
  }

  /**
   * Loggin un utilisateur
   * @param email email de l'utilisateur
   * @param password mot de passe de l'utilisateur
   */
  loginUser(email: string, password: string) {
    return this.httpClient.post<User>(`${this.userUrl}/login`, {email, password}, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur lors du Login: ${err.statusText}`);
        return of(err);
      }))
  }

  logoutUser() {
    return this.httpClient.get(`${this.userUrl}/logout`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
      .subscribe(() => {
        this.user = undefined;
        this.log(`Déconnecté`);
        this.router.navigate(['/login']);
      })
  }

  getCurrentUserInfo() {
    return this.httpClient.get(`${this.userUrl}/currentuser`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  createNewUser(name: string, email: string, password: string) {
    return this.httpClient.post(`${this.userUrl}/new`, {name, email, password}, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }
}
