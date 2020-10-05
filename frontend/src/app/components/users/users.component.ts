import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpResponse } from 'src/app/interfaces/HttpResponse.interface';
import { MessagesService } from 'src/app/services/messages.service';


import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private searchTerms = new Subject<string>();

  constructor(
    public usersService: UsersService,
    private messagesService: MessagesService
  ) { }

  public ngOnInit(): void {
    this.usersService.getAllUsers();

    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.usersService.searchUsers(term)),
    ).subscribe((response: HttpResponse) => {
      if (response.status === 200) {
        this.usersService.users = response.body.users;
      } else {
        this.messagesService.add('Erreur: Recherche impossible');
      }
    });
  }

  public searchUser(term: string): void {
    this.searchTerms.next(term);
  }

}
