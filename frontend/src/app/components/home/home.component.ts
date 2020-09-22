import { Component, OnInit } from '@angular/core';

import { PublicationsService } from "../../services/publications.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts: any;

  constructor(
    private publicationsService: PublicationsService
  ) { }

  ngOnInit(): void {
    this.publicationsService.getAllPublications()
      .subscribe(response => {
        console.log(response.posts);
        this.posts = response.posts;
      })
  }

}
