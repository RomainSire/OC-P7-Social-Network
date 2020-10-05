import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private backendServer = environment.backendServer;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService
    ) { }

  public canActivate(): Observable<boolean>|Promise<boolean>|boolean {
    return this.httpClient.get(`${this.backendServer}/api/user/isauth`, { withCredentials: true })
      .pipe(
        catchError(err => {
          this.router.navigate(['/login']);
          this.authService.user = undefined;
          return of(false);
        }),
        map(res => {
          return true;
        })
      );
  }
}
