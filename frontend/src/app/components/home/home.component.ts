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

}
