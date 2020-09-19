import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserDetails } from "../../models/UserDetails";
import { UsersService } from "../../services/users.service";
import { AuthService } from "../../services/auth.service";
import { MessagesService } from "../../services/messages.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userDetails: UserDetails;
  id: number;
  passwordChangeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // force  à récupérer les infos user, même si on on ne change que le paramètre de la route.
    this.initForm();
  }

  // Initialisation des formulaires
  initForm() {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    })
  }

  /**
   * Récupération des informations de l'utilisateur affiché
   */
  getUser() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.usersService.getOneUser(id)
      .subscribe(fetchedUser => {
        this.userDetails = fetchedUser;
        if (fetchedUser.pictureurl === null) {
          this.userDetails.pictureurl = "./assets/anonymousUser.svg";
        }
        if (fetchedUser.outline === null) {
          this.userDetails.outline = "Pas de description";
        }
      })
  }


  /**
   * Mise à jour de la photo de profil utilisateur
   */
  onChangeProfilePicture(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      console.log(fileInput.target.files[0]);
      // Envoyer le fichier au backend dans un formdata
    } 
  }


  /**
   * Mise à jour de la description du profil utilisateur
   */
  onUpdateOutline(event: any) {
    if (event.target[0].value && event.target[0].value !== "") {
      const newOutline = event.target[0].value;
      this.usersService.updateOutline(this.userDetails.id, newOutline)
        .subscribe(data => {
          if (data.message === "Description du profil modifiée") {
            this.getUser();
            event.target[0].value = "";
            this.messagesService.add(`Votre description de passe a bien été modifiée`);
          } else {
            this.messagesService.add(`Une erreur s'est produite`);
          }
        })
    }
  }

  /**
   * Changement du mot de passe de l'utilisateur
   */
  onChangePassword() {
    const newPassword = this.passwordChangeForm.get('oldPassword').value;
    const oldPassword = this.passwordChangeForm.get('newPassword').value;
    if (newPassword && newPassword != "" && oldPassword && oldPassword != "") {
      this.usersService.updatePassword(this.userDetails.id, newPassword, oldPassword)
        .subscribe(data => {
          if (data.message === "Mot de passe modifié") {
            this.passwordChangeForm.reset();
            this.messagesService.add(`Votre mot de passe a bien été modifié`);
          } else {
            this.messagesService.add(`Erreur: ${data.error.error}`);
          }
        })
    }
  }

  /**
   * Suppression du profil, en 2 temps
   * - Click pour la suppression
   * - Click pour confirmer la suppressions
   */
  onDeleteClicked() {
    document.getElementById('delete-confirm').classList.remove("profile--delete-confirm__hidden");
  }
  onDeleteConfirmed() {
    console.log("Delete!");
  }

  /**
   * Donner / Supprimer les droits d'admin
   */
  onChangeAdmin(isAdmin) {
    this.usersService.updateAdminRights(this.userDetails.id, isAdmin)
      .subscribe(data => {
        console.log(data);
        if (data.message === "Droits d'administrateur modifiée") {
          this.messagesService.add(`Les droits d'administration ont bien été modifiés`);
        } else {
          this.messagesService.add(`Erreur: ${data.error.error}`);
        }
        this.getUser();
      })
  }

}
