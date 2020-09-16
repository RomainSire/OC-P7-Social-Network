import { Component, OnInit } from '@angular/core';

import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.getAllUsers()
      .subscribe(data => {
        this.users = data.users.map(user => {
          if (user.pictureurl === null) {
            user.pictureurl = "./assets/anonymousUser.svg";
          }
          return user;
        })
      })
  }

}
