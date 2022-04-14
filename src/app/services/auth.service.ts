import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url: string = environment.api_url;
  constructor(
    private http: HttpClient,
  ) { }

  public login(login: any) {
    const data = this.http.post(this.api_url + "/api/login", login);
    return data;
  }


  setToken(token:string) {
    localStorage.setItem('access_token', token);
  }

  getToken():any {
    return localStorage.getItem("access_token");
  }

  isLoggedIn() {
    return this.getToken() != null;
  }
}
