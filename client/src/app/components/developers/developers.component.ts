import { Component, OnInit } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $(document).ready(function () {
      $("#rightsidebar").hide();
      $('#rightdiv').hide();
      $('#leftdiv').hide();
      $(".vr").hide();
      $('#centerdiv').removeClass('col-md-7').addClass('col-md-12');
      $(window).scrollTop(0);

    });

  }

}
