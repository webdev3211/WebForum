import { Component, OnInit } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

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
