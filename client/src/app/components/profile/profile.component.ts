import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

declare var $: any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name;
  email;
  userid;
  mypostslist;


  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }





  ngOnInit() {

    // $("#rightsidebar").hide();
    $("#howtoask").hide();
    $("#howtoformat").hide();

    $(document).ready(function () {
      $(window).scrollTop(0);
      $('#rightdiv').show();
      $('#leftdiv').show();
      $(".vr").show();
      $("#rightsidebar").hide();
      $('#centerdiv').removeClass('col-md-12').addClass('col-md-7');
    });

    this.authService.getProfile().subscribe(profile => {
      this.name = profile.user.name;
      this.email = profile.user.email;
      this.userid = profile.user._id;
    })
  }

}
