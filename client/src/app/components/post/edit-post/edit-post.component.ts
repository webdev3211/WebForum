import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

declare var $: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  message;
  messageClass;
  blog;
  processing = false;
  currentUrl;
  loading = true;


  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private router: Router

  ) { }

  updateBlogSubmit() {
    this.processing = true;
    //function to update the blog
    this.postService.editBlog(this.blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = 'Blog not found.'; // Set error message
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success',
          this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/singlePost/' + this.currentUrl.id]);
        }, 2000);
      }

    });

  }

  goBack() {
    this.location.back();
  }


  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Function to GET current blog with id in params
    this.postService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = 'Blog not found.'; // Set error message
      } else {
        this.blog = data.post; // Save blog object for use in HTML
        this.loading = false; // Allow loading of blog form
      }
    });

    $("howtoask").show();
    $("howtoformat").show();

  }


}






