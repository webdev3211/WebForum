import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
declare var $: any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  allusers;

  constructor(
    private usersService: UsersService,

  ) { }

  ngOnInit() {

    $("#howtoask").hide();
    $("#howtoformat").hide();
    this.usersService.showAllUsers().subscribe(data => {
      this.allusers = data.data;
    })
  }


}
