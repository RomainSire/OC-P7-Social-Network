import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


import { UsersService } from "../../services/users.service";

interface User {
  id: number;
  name: string;
  pictureurl: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users;
  private searchTerms = new Subject<string>();

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.getAllUsers()
      .subscribe(data => {
        this.users = data.users
      })
    
    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.usersService.searchUsers(term)),
    ).subscribe(data => {
      this.users = data.users;
    })
  }

  searchUser(term: string): void {
    this.searchTerms.next(term);
  }

}
