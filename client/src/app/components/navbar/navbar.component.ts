import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PostService } from '../../services/post.service';
import { TagsService } from '../../services/tags.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {


  socket;
  searchingfor = '';
  searchResults;
  sForm;
  value = '';
  show = false;
  notifications;
  userid;
  notificationlist;
  noofunreadnotiofications;
  count = 0;
  viewloaded = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostService,
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
    // this.socket = io();

  }

  ngAfterViewInit() {
    this.viewloaded = true;
    this.count = this.notificationlist.length;
  }


  movetonotificationpost(id, link) {

    this.authService.readNotification(id).subscribe(data => {
      this.notificationlist = data.data;

    });


    // this.authService
    console.log(id);
    setTimeout(() => {
      this.router.navigate(['/singlePost', link]);
      location.reload();

    }, 1000);


  }


  movetopost(id) {
    console.log(id);
    setTimeout(() => {
      this.router.navigate(['/singlePost', id]);
      location.reload();

    }, 100);

    this.show = false;
  }

  onEnter(value: string) {
    this.show = true;
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

  toggleshow() {
    this.show = false;
  }


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

  getUserNotifications() {
    this.authService.getNotifications().subscribe(data => {
      this.notifications = data.data;
      this.notificationlist = this.notifications;
      this.count = this.notificationlist.length;

    })

  }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.userid = profile.user._id;
    });


    this.getUserNotifications();

    // this.socket.on('newTaskAdded', () => {

    this.authService.getNotifications().subscribe(data => {

      this.notificationlist = data.data;
      this.count = this.notificationlist.length;
    })

    // });



    // console.log(this.userid);
    // this.postService.getNotification().subscribe(data => {
    //   this.notifications = data.data;
    // });


  }


}