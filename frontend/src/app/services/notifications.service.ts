import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { MessagesService } from './messages.service';
import { Notification } from '../interfaces/Notification.interface';
import { HttpResponse } from '../interfaces/HttpResponse.interface';

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
    this.messagesService.add(`Notifications: ${message}`);
  }

  public getNotifications(): void {
    this.httpClient.get(`${this.notificationsUrl}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
      .subscribe((response: HttpResponse) => {
        if (response.status === 200) {
          this.notifications = response.body.notifications;
        } else {
          this.log('Impossible de charger les notifications');
        }
      });
  }

  public deleteOneNotification(notificationId: number): Observable<HttpResponse> {
    return this.httpClient.delete(`${this.notificationsUrl}/${notificationId}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  public deleteAllNotifications(): Observable<HttpResponse> {
    return this.httpClient.delete(`${this.notificationsUrl}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }
}
