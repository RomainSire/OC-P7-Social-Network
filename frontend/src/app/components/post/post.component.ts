import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PublicationsService } from 'src/app/services/publications.service';
import { Post } from 'src/app/interfaces/Post';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { LikesService } from 'src/app/services/likes.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postId: number;
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationsService: PublicationsService,
    public authService: AuthService,
    private messagesService: MessagesService,
    private likesService: LikesService,
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.postId = +this.route.snapshot.paramMap.get('id');
    this.getPublication();
  }

  getPublication(): void {
    this.publicationsService.getOnePublication(this.postId)
      .subscribe(data => {
        this.post = data.post[0];
      })
  }

  onDeletePublication(): void {
    this.publicationsService.deletePublication(this.postId)
      .subscribe(data => {
        if (data.message === 'Publication supprimée') {
          this.messagesService.add(`Publication supprimée`);
          this.router.navigate(['/home']);
        } else {
          this.messagesService.add(`Une erreur s'est produite`);
        }
      })
  }

  onlike(event: Event) {
    const postId = this.postId;
    const rate: number = parseInt(event.target[1].value,10);
    this.likesService.newRatePublication(postId, rate)
      .subscribe((data: {message?: string}) => {
        if (data.message === 'Like ou dislike pris en compte') {
          this.getPublication();
        } else {
          this.messagesService.add(`Erreur: votre like/dislike n'a pas été pris en compte`);
        }
      })
  }

  onAddComment(event) {
    const content: string = event.target[0].value;
    const postId: number = parseInt(event.target[1].value);
    this.commentsService.newComment(postId, content)
      .subscribe((data: {message?: string}) => {
        if (data.message === 'Commentaire ajoutée') {
          this.getPublication();
        } else {
          this.messagesService.add(`Erreur: impossible d'ajouter ce commentaire`);
        }
      })
  }

  onDeleteComment(event) {
    const commentId: number = parseInt(event.target[0].value);
    this.commentsService.deleteComment(commentId)
      .subscribe((data: {message?: string}) => {
        if (data.message === 'Commentaire supprimée') {
          this.getPublication();
        } else {
          this.messagesService.add(`Erreur: impossible de supprimer ce commentaire`);
        }
      })
  }

}
