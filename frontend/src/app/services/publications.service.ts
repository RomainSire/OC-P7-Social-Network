import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private postsUrl = 'http://localhost:3000/api/post';

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messagesService.add(`PublicationsService: ${message}`);
  }


  getAllPublications() {
    return this.httpClient.get(`${this.postsUrl}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  newPublication(formData: FormData) {
    return this.httpClient.post(`${this.postsUrl}`, formData, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

  deletePublication(postId: Number) {
    return this.httpClient.delete(`${this.postsUrl}/${postId}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }))
  }

}
