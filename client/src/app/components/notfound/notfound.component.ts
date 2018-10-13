import { Component, OnInit } from '@angular/core';

declare var $: any;


@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function(){
      $('#rightdiv').hide();
      $('#leftdiv').hide();
      $(".vr").hide();
       $('#centerdiv').removeClass('col-md-7').addClass('col-md-12');
      $(window).scrollTop(0);
       
   });
  }

}
