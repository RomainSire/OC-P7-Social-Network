import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { MessagesService } from "./messages.service";

import { Notification } from "../models/Notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: Notification[];

  private notificationsUrl = 'http://localhost:3000/api/notif';

  constructor(
    private httpClient: HttpClient,

    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messagesService.add(`Authentification: ${message}`);
  }

  getNotifications() {
    return this.httpClient.get(`${this.notificationsUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
      .subscribe(data => {
        if (data.notifications) {
          this.notifications = data.notifications;
        }
      })
  }

  deleteOneNotification(notificationId: number) {

  }

  deleteAllNotifications() {
    return this.httpClient.delete(`${this.notificationsUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }
}
