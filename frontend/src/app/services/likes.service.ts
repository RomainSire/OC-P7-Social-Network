import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { MessagesService } from "./messages.service";


@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private likeUrl = 'http://localhost:3000/api/like';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messagesService.add(`LikesService: ${message}`);
  }

  newRatePublication(postId: number, rate: number) {
    return this.httpClient.post(`${this.likeUrl}`, {postId, rate}, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }
}
