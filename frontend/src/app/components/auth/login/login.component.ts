import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from "../../../services/user.service";
import { MessagesService } from "../../../services/messages.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.messagesService.add(`Paramètres saisis: { email: ${f.value.email}, password: ${f.value.password} }`);
    this.userService.loginUser(f.value.email, f.value.password)
  }

}
