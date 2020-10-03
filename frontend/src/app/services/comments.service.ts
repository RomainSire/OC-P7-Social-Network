import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private commentUrl = 'http://localhost:3000/api/comment';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string): void {
    this.messagesService.add(message);
  }

  newComment(postId: number, content: string) {
    return this.httpClient.post(`${this.commentUrl}`, {postId, content}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  deleteComment(commentId: number) {
    return this.httpClient.delete(`${this.commentUrl}/${commentId}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }
}
