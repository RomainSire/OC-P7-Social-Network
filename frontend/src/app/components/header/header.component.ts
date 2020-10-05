import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public notificationsService: NotificationsService
  ) { }

  public ngOnInit(): void {
    this.authService.getCurrentUserInfo();
  }

  public onLogout(): void {
    this.authService.logoutUser();
  }
}
