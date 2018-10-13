import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class PostService {


  options;
  domain = this.authService.domain;


  constructor(
    private authService: AuthService,
    private http: Http
  ) { }


  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })

    });
  }


  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'posts/createPost', blog, this.options).map(res => res.json())
  }

  get_AllBlogs(oPosts) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'posts/', JSON.stringify(oPosts), this.options).map(res => res.json());
  }

  // Function to get the post using the id
  getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'posts/' + id, this.options).map(res => res.json());
  }

  likeBlog(id) {

    // this.createAuthenticationHeaders(); // Create headers
    const blogData = { id: id }

    return this.http.put(this.domain + 'posts/like/', blogData, this.options).map(res => res.json());
  }

  dislikeBlog(id) {
    const blogData = { id: id }

    // this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'posts/dislike/', blogData, this.options).map(res => res.json());
  }

  editBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'posts/updateBlog/', blog, this.options).map(res => res.json())
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'posts/deleteBlog/' + id, this.options).map(res => res.json())
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'posts/comment', blogData, this.options).map(res => res.json())
  }


  searching(searchquery) {
    // this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'posts/search', searchquery, this.options).map(res => res.json())

  }


}
