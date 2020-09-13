import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessagesService } from "./messages.service";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  private userUrl = 'http://localhost:3000/api/user';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService
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
    return this.httpClient.post<User>(`${this.userUrl}/login`, {email, password}, this.httpOptions)
      .pipe(catchError(err => {
        this.log(`Erreur lors du Login: ${err.statusText}`);
        return of(err);
      }))
  }

}
