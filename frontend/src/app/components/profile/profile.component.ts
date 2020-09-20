import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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

  initialImage: any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';


  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messagesService: MessagesService
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
    this.usersService.deleteUser(this.userDetails.id)
      .subscribe(data => {
        if (data.message === "Utilisateur supprimé") {
          this.messagesService.add(`Vous avez bien supprimé votre compte`);
          this.router.navigate(['/login']);
        } else {
          this.messagesService.add(`Erreur: ${data.error.error}`);
        }
      })
  }

  /**
   * Donner / Supprimer les droits d'admin
   */
  onChangeAdmin(isAdmin) {
    this.usersService.updateAdminRights(this.userDetails.id, isAdmin)
      .subscribe(data => {
        if (data.message === "Droits d'administrateur modifiée") {
          this.messagesService.add(`Les droits d'administration ont bien été modifiés`);
        } else {
          this.messagesService.add(`Erreur: ${data.error.error}`);
        }
        this.getUser();
      })
  }


  /**
   * Mise à jour de la photo de profil utilisateur
   * Utilisation de la librairie "ngx-image-cropper"
   */
  // Nouveau fichier sélectionné
  onChangeProfilePicture(event) {
    this.imageChangedEvent = event;
    this.initialImage = event.target.files[0];
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    document.getElementById('cropper').classList.remove('hidden');
  }
  loadImageFailed() {
    this.messagesService.add(`Erreur lors du chargement de l'image`);
  }
  // Transformation de l'image base64 (donnée par "ngx-image-cropper") en fichier exploitable
  base64ToFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
  // à la validation, après le redimensionnement de l'image = envoi du fichier vers le backend
  onCroppedImageDone() {    
    const base64Image = this.croppedImage;
    const image = this.base64ToFile(base64Image, this.initialImage.name);
    const uploadData = new FormData();
    uploadData.append('image', image);
    this.usersService.updatePicture(this.userDetails.id, uploadData)
      .subscribe(data => {        
        if (data.message === "Photo de profil modifiée") {
          this.getUser();
          this.authService.getCurrentUserInfo();
          this.messagesService.add(`Votre photo de profil a bien été modifiée`);
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
        document.getElementById('cropper').classList.add('hidden');
      })
  }
}
