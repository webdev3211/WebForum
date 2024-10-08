import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';




@Injectable()
export class TagsService {


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


  showTags() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'tags/', this.options).map(res => res.json());

  }



  tagsrelatedwithpostcount(tagid) {
    return this.http.get(this.domain + 'posts/tags/count' + tagid, this.options).map(res => res.json());
  }


}
