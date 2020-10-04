import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private postsUrl = `${environment.backendServer}/api/post`;

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string): void {
    this.messagesService.add(message);
  }


  getPublications(limit: number, offset: number): Observable<any> {
    return this.httpClient.get(`${this.postsUrl}/${limit}/${offset}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  getOnePublication(id: number): Observable<any> {
    return this.httpClient.get(`${this.postsUrl}/${id}`, { withCredentials: true })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  newPublication(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.postsUrl}`, formData, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  deletePublication(postId: number): Observable<any> {
    return this.httpClient.delete(`${this.postsUrl}/${postId}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

}
