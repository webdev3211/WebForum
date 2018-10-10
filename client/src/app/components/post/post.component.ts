import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { TagsService } from '../../services/tags.service';
import { Router } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  tagselected;

  messageClass;
  message;
  loadingBlogs = false;
  form;
  logedinuserid;
  commentForm;
  processing = false;
  name;
  blogPosts;
  newComment = [];
  enabledComments = [];
  tags;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private postService: PostService,
    private tagsService: TagsService,
    private router: Router,
    


  ) {
    this.createNewBlogForm();
    $("howtoask").show();
      $("howtoformat").show();
  
  }



  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
      ])],
      content: ['', Validators.compose([
        Validators.required,
      ])],
      tag: new FormControl('', Validators.required)
    })
  }

  getAlltagsList() {
    this.tagsService.showTags().subscribe(data => {
      this.tags = data.data;
    })
  }

  // Enable new blog form
  enableFormNewBlogForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('content').enable(); // Enable content field
    this.form.get('tag').enable(); //Enable tag field
  }

  // Disable new blog form
  disableFormNewBlogForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('content').disable(); // Disable content field
    this.form.get('tag').disable(); //disable tag field

  }

  ontagSelect($event: any) {
    this.tagselected = this.form.controls["tag"].value;
    console.log(this.tagselected);
  }


  onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();

    // Create blog object from form fields
    const blog = {
      title: this.form.get('title').value, // Title field
      content: this.form.get('content').value, // content field
      tag: this.tagselected
      // author: this.logedinuserid 
    }

    this.postService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger',
          this.message = data.message,
          this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success',
          this.message = data.message,
          // this.getAllBlogs();
          //Clear form data after two seconds
          setTimeout(() => {
            this.processing = false;
            this.message = false;
            this.form.reset();
            this.router.navigate(['/']);            
          }, 2000);

      }
    });
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

 



  ngOnInit() {
      $("howtoask").show();
      $("howtoformat").show();
  
    this.getAlltagsList();
    this.authService.getProfile().subscribe(profile => {
      this.name = profile.user.name;
      this.logedinuserid = profile.user._id
    });

    // this.getAllBlogs();
  }

}
