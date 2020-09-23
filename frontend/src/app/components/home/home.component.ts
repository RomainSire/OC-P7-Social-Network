import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { PublicationsService } from "../../services/publications.service";
import { AuthService } from "../../services/auth.service";
import { MessagesService } from "../../services/messages.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts: any;

  initialImage: any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private publicationsService: PublicationsService,
    public authService: AuthService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.getPosts();
  }

  /**
   * Récupérer tous les posts, avec leurs commentaires et leur likes/dislikes
   */
  getPosts(): void {
    this.publicationsService.getAllPublications()
      .subscribe(response => {
        this.posts = response.posts;
      })
  }

  /**
   * Publication d'un nouveau post
   */
  // A - Ajout d'une photo
  fileChangeEvent(event: any): void {
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
  onCroppedImageDone() {
    document.getElementById('cropper').classList.add('hidden');
  }
  onSubmitNewPost(event) {
    const content = event.target[0].value;
    const base64Image = this.croppedImage;
    const formData = new FormData();
    if (!content && !base64Image) {
      return this.messagesService.add(`Vous devez publier un texte ou une image, ou les 2!`);
    }
    if (base64Image) {
      const image = this.base64ToFile(base64Image, this.initialImage.name);
      formData.append('image', image);
    }
    formData.append('content', content);
    
    this.publicationsService.newPublication(formData)
      .subscribe(data => {
        if (data.message === 'Publication ajoutée') {
          this.getPosts();
          this.messagesService.add(`Publication ajoutée`);
          // reset du formulaire
          event.target[0].value = "";
          this.croppedImage = undefined;
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
      })
  }

  /**
   * Suppression d'une publication
   */
  onDeletePublication(event) {
    const postId = event.target[0].value;
    this.publicationsService.deletePublication(postId)
      .subscribe(data => {
        if (data.message === 'Publication supprimée') {
          this.getPosts();
          this.messagesService.add(`Publication supprimée`);
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
      })
  }

}
