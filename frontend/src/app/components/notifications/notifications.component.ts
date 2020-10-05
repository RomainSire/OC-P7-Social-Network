import { Component, OnInit } from '@angular/core';
import { HttpResponse } from 'src/app/interfaces/HttpResponse.interface';
import { MessagesService } from 'src/app/services/messages.service';

import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public notificationsService: NotificationsService,
    private messagesService: MessagesService
  ) { }

  public ngOnInit(): void {
    this.notificationsService.getNotifications();
  }

  public onDeleteOne(id: number): void {
    this.notificationsService.deleteOneNotification(id)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.notificationsService.getNotifications();
        } else {
          this.messagesService.add('Impossible de supprimer la notification');
        }
      });
  }

  public onDeleteAll(): void {
    this.notificationsService.deleteAllNotifications()
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.notificationsService.getNotifications();
        } else {
          this.messagesService.add('Impossible de supprimer les notifications');
        }
      });
  }
}
