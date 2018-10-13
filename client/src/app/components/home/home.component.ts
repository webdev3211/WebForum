import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { TagsService } from '../../services/tags.service';



import { Router, Params, ActivatedRoute } from '@angular/router';

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

  pgCounter: number;
  qpage: number;
  totalrows;


  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private tagsService: TagsService,
  ) {
    $(".vr").show();
    $('#rightdiv').show();
    $('#leftdiv').show();

    $("#howtoask").hide();
    $("#howtoformat").hide();
    $(".footer").hide();
    // $(window).scrollTop(0);

  }

  getAllBlogs(payload?) {
    this.postService.get_AllBlogs(payload).subscribe(data => {

      this.totalrows = data.posts.total;
      this.pgCounter = Math.floor((this.totalrows + 10 - 1) / 10);

      this.blogPosts = data.posts.docs;

    });
  }

  setPage(page): void {
    this.router.navigate(['/'],
      {
        queryParams: { page: page }
      }
    );
    setTimeout(function () {
      $(window).scrollTop(0);
    }, 1500);

  }

  createPager(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }

    return items;
  }



  likeBlog(id) {
    this.postService.likeBlog(id).subscribe(data => {
      console.log(id);
      this.getAllBlogs();
    });


  }

  dislikeBlog(id, payload) {
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
      $("#rightsidebar").show();

      $('#centerdiv').removeClass('col-md-12').addClass('col-md-7');
      $('#rightdiv').show();
      $('#leftdiv').show();
      $(".vr").show();
      $(".footer").show();
      $(window).scrollTop(0);

    });




    this.route.queryParams.forEach((params: Params) => {
      this.qpage = params['page'] || '';
      let payload: any = {};
      payload.page = this.qpage;

      this.getAllBlogs(payload);

    })

  }

}
