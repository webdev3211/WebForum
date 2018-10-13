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

  searchingfor = '';
  searchResults;
  sForm;
  value = '';

  constructor(
    private formBuilder: FormBuilder, 
    private postService: PostService,

    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
   
    
   }

   onEnter(value: string) { 
     this.searchingfor = value;

     const searchh = {
       search: this.searchingfor
     }
    this.postService.searching(searchh).subscribe(data => {
        this.searchResults = data.data;
    });
 
   }
   
  //  search($event: any){
  //  this.searchingfor = $event.target.value;

  //  if($event.key == 13)
  //   // this.postService.searching('moment').subscribe(data => {
  //   //   this.searchResults = data.data
  //   // })

  //  }

   

   
  //  onKey(event: any) { // without type info
   
  //   // Create blog object from form fields
  //   const searchh = {
  //     search: this.form.get('search').value, // Title field
  //   }
  //   this.postService.search(searchh).subscribe(data => {
  //     this.searchResults = data;
  //   }); 
  // }


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