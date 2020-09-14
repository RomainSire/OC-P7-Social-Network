import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    ) { }

  canActivate(): Observable<boolean>|Promise<boolean>|boolean {
    return this.httpClient.get('http://localhost:3000/api/user/isauth', { withCredentials: true })
      .pipe(catchError(err => {
        this.router.navigate(['/login']);
        return of(false);
      }))
      .pipe(map(res => {
        return true;
      }))
  }
}
