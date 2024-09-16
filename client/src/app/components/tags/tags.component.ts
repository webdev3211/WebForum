import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../services/tags.service';

declare var $: any;

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  alltags;

  constructor(
    private tagsService: TagsService,

  ) { }

  ngOnInit() {
    $("#howtoask").hide();
    $("#howtoformat").hide();



    this.tagsService.showTags().subscribe(data => {
      this.alltags = data.data;
    })
  }

}
