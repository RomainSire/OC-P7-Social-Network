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
export class LikesService {

  private likeUrl = `${environment.backendServer}/api/like`;

  constructor(
    private httpClient: HttpClient,
    private messagesService: MessagesService,
  ) { }

  /** Log a message with the MessageService */
  private log(message: string): void {
    this.messagesService.add(message);
  }

  public newRatePublication(postId: number, rate: number): Observable<HttpResponse> {
    return this.httpClient.post(`${this.likeUrl}`, {postId, rate}, { withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        this.log(`Erreur: ${err.statusText}`);
        return of(err);
      }));
  }
}
