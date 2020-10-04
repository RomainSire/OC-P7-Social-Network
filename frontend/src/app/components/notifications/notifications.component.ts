import { Component, OnInit } from '@angular/core';

import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.notificationsService.getNotifications();
  }

  onDeleteAll(): void {
    this.notificationsService.deleteAllNotifications()
      .subscribe(data => {
        this.notificationsService.getNotifications();
      });
  }

  onDeleteOne(id: number): void {
    this.notificationsService.deleteOneNotification(id)
      .subscribe(data => {
        this.notificationsService.getNotifications();
      });
  }

}
