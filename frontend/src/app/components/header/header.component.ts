import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo()
      .subscribe(data => {
        if (data.userId) {
          this.authService.user = data;
          if (data.pictureUrl === null) {
            this.authService.user.pictureUrl = "./assets/anonymousUser.svg"
          }
        }
      })
  }

  onLogout() {
    this.authService.logoutUser();
  }
}