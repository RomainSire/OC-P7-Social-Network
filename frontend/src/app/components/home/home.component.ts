import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { PublicationsService } from "../../services/publications.service";
import { AuthService } from "../../services/auth.service";
import { MessagesService } from "../../services/messages.service";
import { CommentsService } from "../../services/comments.service";
import { LikesService } from "../../services/likes.service";

import { Post } from "../../models/Post";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts: Post[]; // Posts affichés
  postsBatch: number = 2; // Nombre de post supplémentaires chargés, lorsqu'on arrive en bas de page


  initialImage: any = ''; // Image avant le crop/resize
  imageChangedEvent: any = '';
  croppedImage: any = ''; // Image après le crop/resize (envoyée au backend)

  constructor(
    private publicationsService: PublicationsService,
    public authService: AuthService,
    private messagesService: MessagesService,
    private commentsService: CommentsService,
    private likesService: LikesService
  ) { }

  ngOnInit(): void {
    this.getPostsFromStart(this.postsBatch);
  }

  /**
   * Récupérer tous les posts, avec leurs commentaires et leur likes/dislikes
   */
  //Récupérer tous les posts depuis le début jusqu'au chargtement actuel
  getPostsFromStart(numberOfPosts: number) {
    this.publicationsService.getPublications(numberOfPosts, 0)
      .subscribe(response => {
        this.posts = response.posts;
      })
  }
  // charger de nouveaux posts petit à petit
  getOtherPosts(limit: number, offset: number): void {
    this.publicationsService.getPublications(limit, offset)
      .subscribe(response => {
        const oldPosts: Post[] = this.posts;
        const newPosts: Post[] = response.posts;
        this.posts = oldPosts.concat(newPosts);
      })
  }

  /**
   * Récupération des posts au scroll de la page (pour infinite scroll)
   */
  onScroll() {
    console.log('scrolled!!');
    this.getOtherPosts(this.postsBatch, this.posts.length)
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
          this.getPostsFromStart(this.posts.length);
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
          this.getPostsFromStart(this.posts.length);
          this.messagesService.add(`Publication supprimée`);
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
      })
  }


  /**
   * Ajout d'un commentaire
   */
  onAddComment(event) {
    const content = event.target[0].value;
    const postId = event.target[1].value;
    this.commentsService.newComment(postId, content)
      .subscribe(data => {
        if (data.message === 'Commentaire ajoutée') {
          this.getPostsFromStart(this.posts.length);
        } else {
          this.messagesService.add(`Erreur: impossible d'ajouter ce commentaire`);
        }
      })
  }

  /**
   * Suppression d'un commentaire
   */
  onDeleteComment(event) {
    const commentId = event.target[0].value;
    this.commentsService.deleteComment(commentId)
      .subscribe(data => {
        if (data.message === 'Commentaire supprimée') {
          this.getPostsFromStart(this.posts.length);
        } else {
          this.messagesService.add(`Erreur: impossible de supprimer ce commentaire`);
        }
      })
  }

  /**
   * Like/dislike/annulation d'une publication
   */
  onlike(event) {
    const postId = event.target[0].value;
    const rate = parseInt(event.target[1].value,10);
    this.likesService.newRatePublication(postId, rate)
      .subscribe(data => {
        if (data.message === 'Like ou dislike pris en compte') {
          this.getPostsFromStart(this.posts.length);
        } else {
          this.messagesService.add(`Erreur: votre like/dislike n'a pas été pris en compte`);
        }
      })
  }

}
