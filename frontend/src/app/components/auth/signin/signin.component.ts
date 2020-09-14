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
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  onSubmit() {
    const name = this.signInForm.get('name').value;
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    this.authService.createNewUser();
  }

}
