import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from "../../../services/auth.service";
import { MessagesService } from "../../../services/messages.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;

  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    })
  }

  onSubmit() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authService.loginUser(email, password)
      .subscribe(data => {
        if (data.message === "Utilisateur loggé") {
          this.authService.user = data;
          if (data.pictureUrl === null) {
            this.authService.user.pictureUrl = "./assets/anonymousUser.svg"
          }
          this.messagesService.add(`Connecté en tant que: ${this.authService.user.name}, avec l'ID: ${this.authService.user.userId}`);
          this.router.navigate(['/home']);
        } else {
          this.messagesService.add(`Erreur de connexion: ${data.error.error}`);
        }
      });
  }

}
