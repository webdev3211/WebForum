import { Component, OnInit, AfterViewChecked, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';
import { TagsService } from '../../../services/tags.service';
import { Router } from '@angular/router';

import { HighlightService } from '../../../highlight.service';

import { HighlightJsService } from 'angular2-highlight-js';

import { ActivatedRoute } from "@angular/router";


declare var $: any;



@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit, AfterViewChecked {


  newComment = [];
  enabledComments = [];
  commentForm;

  highlighted: boolean = false;


  singlePostId;

  showcommentform = false;

  message;
  messageClass;
  blog;
  processing = false;
  currentUrl;
  loading = true;

  name;
  loggedinuserid;

  commentslist;

  constructor(
    private highlightJsService: HighlightJsService,
    private formBuilder: FormBuilder,
    private highlightService: HighlightService,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    this.createCommentForm();

  }

  highlightByService(target: ElementRef) {
    this.highlightJsService.highlight(target);
  }

  ngAfterViewChecked() {
    if (this.blog && !this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],

    });
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable();

  }


  disableCommentForm() {
    this.commentForm.get('comment').disable();

  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
    this.showcommentform = true;
  }

  cancelSubmission(id) {
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
    this.showcommentform = false;
  }

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;

    this.postService.postComment(id, comment).subscribe(data => {
      this.showcommentform = false;

      // this.showPost();
      // const index = this.newComment.indexOf(id);
      //  this.newComment.splice(index, 1);
      this.commentslist = data.post.comments;
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      // if (this.enabledComments.indexOf(id) < 0) {
      //   this.expand(id);
      // }


    });

  }


  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }




  showPost() {
    this.postService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = 'Blog not found.'; // Set error message
      } else {
        this.blog = data.post; // Save blog object for use in HTML
        this.commentslist = data.post.comments;
        this.loading = false; // Allow loading of blog form
      }
    });

  }

  likeBlog(id) {
    this.postService.likeBlog(id).subscribe(data => {
      console.log(id);
      this.showPost();
    });


  }

  dislikeBlog(id) {
    this.postService.dislikeBlog(id).subscribe(data => {
      console.log(id);
      this.showPost();
    });
  }

  deleteBlog(id) {
    this.postService.deleteBlog(id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-danger'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to blog page
        setTimeout(() => {
          this.router.navigate(['/']); // Route users to main page
        }, 2000);
      }
    });
  }


  ngOnInit() {
    $("#howtoask").hide();
    $("#howtoformat").hide();

    $(document).ready(function () {
      $(window).scrollTop(0);
      $('#rightdiv').show();
      $('#leftdiv').show();
      $(".vr").show();
      $('#centerdiv').removeClass('col-md-12').addClass('col-md-7');
      $("#rightsidebar").show();

    });

    this.showPost();

    this.authService.getProfile().subscribe(profile => {
      this.name = profile.user.name;
      this.loggedinuserid = profile.user._id;
    })


  }


}

