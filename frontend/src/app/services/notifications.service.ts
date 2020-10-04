import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { MessagesService } from "./messages.service";
import { Notification } from "../interfaces/Notification.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public notifications: Notification[];

  private notificationsUrl = `${environment.backendServer}/api/notif`;

  constructor(
    private httpClient: HttpClient,

    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string): void {
    this.messagesService.add(`Authentification: ${message}`);
  }

  getNotifications() {
    return this.httpClient.get(`${this.notificationsUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
      .subscribe((data: {notifications: Notification[]}) => {
        if (data.notifications) {
          this.notifications = data.notifications;
        }
      })
  }

  deleteOneNotification(notificationId: number) {
    return this.httpClient.delete(`${this.notificationsUrl}/${notificationId}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  deleteAllNotifications() {
    return this.httpClient.delete(`${this.notificationsUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }
}
