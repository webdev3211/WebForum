import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("#howtoask").show();
    $("#howtoformat").show();




    $(function () {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
          $('#top').fadeIn();
        }
        else {
          $('#top').fadeOut();
        }
      });
      $('#top').click(function () {
        $('body,html').animate({ scrollTop: 0 }, 500);
      });
    });

  }

}
