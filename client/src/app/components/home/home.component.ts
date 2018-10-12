import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { TagsService } from '../../services/tags.service';



import { Router } from '@angular/router';

declare var $: any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  blogPosts;
  name;
  logedinuserid;


  constructor(
    public authService: AuthService,
    private router: Router,
    private postService: PostService,
    private tagsService: TagsService,
  ) {
    $(".vr").show();
    $('#rightdiv').show();
    $('#leftdiv').show();

    $("#howtoask").hide();
    $("#howtoformat").hide();
    this.getAllBlogs();


  }

  getAllBlogs() {
    this.postService.get_AllBlogs().subscribe(data => {
      this.blogPosts = data.posts;
    });
  }

  likeBlog(id) {
    this.postService.likeBlog(id).subscribe(data => {
      console.log(id);
      this.getAllBlogs();
    });


  }

  dislikeBlog(id) {
    this.postService.dislikeBlog(id).subscribe(data => {
      console.log(id);
      this.getAllBlogs();
    });
  }


  showsidebar() {
    this.router.navigate(['/posts']); // Redirect to login view
    $("#howtoask").show();
    $("#howtoformat").show();

  }

  gotoPost(id) {
    this.router.navigate(['/singlePost', id]);
  }

  ngOnInit() {
    $("#howtoask").hide();
    $("#howtoformat").hide();

    $(document).ready(function () {
      $('#centerdiv').removeClass('col-md-12').addClass('col-md-7');
      $('#rightdiv').show();
      $('#leftdiv').show();
      $(".vr").show();
    });


    this.getAllBlogs();
  }

}
