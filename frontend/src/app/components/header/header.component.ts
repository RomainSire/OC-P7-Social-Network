import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { NotificationsService } from "../../services/notifications.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo();
    this.notificationsService.getNotifications();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}