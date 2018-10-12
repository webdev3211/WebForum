import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PostService } from '../../services/post.service';
import { TagsService } from '../../services/tags.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sform;
 searchResults;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private tagsService: TagsService,

    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {

   }




  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-info',
      timeout: 1000
    });
    this.router.navigate(['/']);
    return false;
  }

  ngOnInit() {
  }

  

}
