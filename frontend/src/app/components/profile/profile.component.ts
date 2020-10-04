import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';
import { ImageService } from '../../services/image.service';

import { UserDetails } from '../../interfaces/UserDetails.interface';
import { HttpResponse } from '../../interfaces/HttpResponse.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userDetails: UserDetails;
  private id: number;
  public passwordChangeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // ci dessus force  à récupérer les infos user, même si on on ne change que le paramètre de la route (= id utilisateur).
    this.initForm();
  }

  // Initialisation des formulaires
  initForm(): void {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
    });
  }

  /**
   * Récupération des informations de l'utilisateur affiché
   */
  getUser(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.usersService.getOneUser(id)
      .subscribe((fetchedUser: UserDetails) => {
        this.userDetails = fetchedUser;
        if (fetchedUser.pictureurl === null) {
          this.userDetails.pictureurl = './assets/anonymousUser.svg';
        }
        if (fetchedUser.outline === null) {
          this.userDetails.outline = 'Pas de description';
        }
      });
  }

  /**
   * Mise à jour de la description du profil utilisateur
   */
  onUpdateOutline(event: Event): void {
    if (event.target[0].value && event.target[0].value !== '') {
      const newOutline: string = event.target[0].value;
      this.usersService.updateOutline(this.userDetails.id, newOutline)
        .subscribe((response: HttpResponse) => {
          if (response.status === 201) {
            this.getUser();
            event.target[0].value = '';
          } else {
            this.messagesService.add(`Erreur: impossible de modifier votre description`);
          }
        });
    }
  }

  /**
   * Changement du mot de passe de l'utilisateur
   */
  onChangePassword(): void {
    const { newPassword, oldPassword } = this.passwordChangeForm.value;
    if (newPassword && newPassword !== '' && oldPassword && oldPassword !== '') {
      this.usersService.updatePassword(this.userDetails.id, newPassword, oldPassword)
        .subscribe((response: HttpResponse) => {
          if (response.status === 201) {
            this.passwordChangeForm.reset();
            this.messagesService.add(`Votre mot de passe a bien été modifié`);
          } else {
            this.messagesService.add(`Erreur: ${response.error.error}`);
          }
        });
    }
  }

  /**
   * Suppression du profil, en 2 temps
   * - Click pour la suppression
   * - Click pour confirmer la suppressions
   */
  onDeleteClicked(): void {
    document.getElementById('delete-confirm').classList.toggle('profile--delete-confirm__hidden');
  }
  onDeleteConfirmed(): void {
    this.usersService.deleteUser(this.userDetails.id)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.messagesService.add(`Vous avez bien supprimé votre compte`);
          this.router.navigate(['/login']);
        } else {
          this.messagesService.add(`Erreur: ${response.error.error}`);
        }
      });
  }

  /**
   * Donner / Supprimer les droits d'admin
   */
  onChangeAdmin(isAdmin: number): void {
    this.usersService.updateAdminRights(this.userDetails.id, isAdmin)
      .subscribe((response: HttpResponse) => {
        if (response.status !== 201) {
          this.messagesService.add(`Erreur: ${response.error.error}`);
        }
        this.getUser();
      });
  }


  /**
   * Mise à jour de la photo de profil utilisateur
   * Utilisation de la librairie "ngx-image-cropper"
   */

  // à la validation, après le redimensionnement de l'image = envoi du fichier vers le backend
  // Donc la méthode onCroppedImage du service imageService ne sera pas utilisé
  onCroppedImageDone(): void {
    const base64Image = this.imageService.croppedImage;
    const image = this.imageService.base64ToFile(base64Image, this.imageService.initialImage.name);
    const uploadData = new FormData();
    uploadData.append('image', image);
    this.usersService.updatePicture(this.userDetails.id, uploadData)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.getUser();
          this.authService.getCurrentUserInfo();
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
        document.getElementById('cropper').classList.add('hidden');
        this.imageService.initialImage = '';
        this.imageService.imageChangedEvent = '';
        this.imageService.croppedImage = '';
      });
  }
}
