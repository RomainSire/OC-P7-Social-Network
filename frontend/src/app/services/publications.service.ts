import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { MessagesService } from './messages.service';
import { HttpResponse } from '../interfaces/HttpResponse.interface';

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


  public getPublications(limit: number, offset: number): Observable<HttpResponse> {
    return this.httpClient.get(`${this.postsUrl}/${limit}/${offset}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  public getOnePublication(id: number): Observable<HttpResponse> {
    return this.httpClient.get(`${this.postsUrl}/${id}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  public newPublication(formData: FormData): Observable<HttpResponse> {
    return this.httpClient.post(`${this.postsUrl}`, formData, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

  public deletePublication(postId: number): Observable<HttpResponse> {
    return this.httpClient.delete(`${this.postsUrl}/${postId}`, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }

}
