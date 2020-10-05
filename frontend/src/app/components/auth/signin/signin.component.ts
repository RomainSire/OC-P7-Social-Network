import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { MessagesService } from '../../../services/messages.service';

import { HttpResponse } from '../../../interfaces/HttpResponse.interface';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public signInForm: FormGroup;

  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.signInForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/[A-Za-zÀ-ÖØ-öø-ÿ ]{3,50}/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      passwordConfirmation: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    }, {validator: this.checkIfMatchingPasswords('password', 'passwordConfirmation')});
  }

  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string): any {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  public onSubmit(): void {
    const name: string = this.signInForm.get('name').value;
    const email: string = this.signInForm.get('email').value;
    const password: string = this.signInForm.get('password').value;
    this.authService.createNewUser(name, email, password)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          // utilisateur créé, il faut maintenant se connecter !
          this.authService.loginUser(email, password);
        } else {
          // Problème lors de l'ajout d'utilisateur
          this.messagesService.add(`Erreur: ${response.error.error}`);
        }
      });
  }

}
