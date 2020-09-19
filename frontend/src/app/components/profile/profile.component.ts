import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserDetails } from "../../models/UserDetails";
import { UsersService } from "../../services/users.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userDetails: UserDetails;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // force  à récupérer les infos user, même si on on ne change que le paramètre de la route.
  }

  getUser() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.usersService.getOneUser(id)
      .subscribe(fetchedUser => {
        this.userDetails = fetchedUser;
        if (fetchedUser.pictureurl === null) {
          this.userDetails.pictureurl = "./assets/anonymousUser.svg";
        }
        if (fetchedUser.outline === null) {
          this.userDetails.outline = "Pas de description";
        }
      })
  }

  onChangeProfilePicture(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      console.log(fileInput.target.files[0]);
      // Envoyer le fichier au backend dans un formdata
    } 
  }

  onUpdateOutline(event: any) {
    if (event.target[0].value && event.target[0].value !== "") {
      console.log(event.target[0].value);
    }
  }

  onChangePassword(event: any) {
    console.log("old: ", event.target[0].value);
    console.log("new: ", event.target[1].value);
    
  }

  onDeleteClicked() {
    document.getElementById('delete-confirm').classList.remove("profile--delete-confirm__hidden");
  }
  onDeleteConfirmed() {
    console.log("Delete!");
  }

  onGrantAdmin() {
    console.log("droits d'admin donné")
  }
  onRemoveAdmin() {
    console.log("droits d'admin supprimé");
    
  }
}
