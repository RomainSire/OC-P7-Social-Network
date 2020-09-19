import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userUrl = 'http://localhost:3000/api/user';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messagesService.add(`UserService: ${message}`);
  }

  getAllUsers() {
    return this.httpClient.get(`${this.userUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  getOneUser(id: number) {
    return this.httpClient.get(`${this.userUrl}/${id}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  updateOutline(id: number, outline: string) {
    return this.httpClient.put(`${this.userUrl}/${id}/outline`, {outline}, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  updatePassword(id: number, oldPassword: string, newPassword: string) {
    return this.httpClient.put(`${this.userUrl}/${id}/password`, {oldPassword, newPassword}, { withCredentials: true })
    .pipe(catchError(err => {
      this.log(`Erreur: ${err.statusText}`);
      return of(err);
    }))
  }
}
