import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from "../../../services/auth.service";
import { MessagesService } from "../../../services/messages.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

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
      name: ['', [Validators.required, Validators.pattern(/[A-Za-zÀ-ÖØ-öø-ÿ ]{3,50}/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      passwordConfirmation: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    },{validator: this.checkIfMatchingPasswords('password', 'passwordConfirmation')});
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  onSubmit() {
    const name = this.signInForm.get('name').value;
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authService.createNewUser(name, email, password)
      .subscribe(data => {
        if (data.message === "Utilisateur créé") {
          // utilisateur créé, il faut maintenant se connecter !
          this.authService.loginUser(email, password)
            .subscribe(data => {
              if (data.message === "Utilisateur loggé") {
                this.authService.user = data;
                this.messagesService.add(`Connecté en tant que: ${this.authService.user.name}, avec l'ID: ${this.authService.user.userId}`);
                this.router.navigate(['/home']);
              } else {
                this.messagesService.add(`Erreur de connexion: ${data.error.error}`);
              }
            });
        } else {
          // Problème lors de l'ajout d'utilisateur
          this.messagesService.add(`Erreur: ${data.error.error}`);
        }
      });
  }

}
