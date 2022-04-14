import { Injectable } from '@angular/core';
import {HttpRequestService} from "./http-request.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  api_url: string = environment.api_url;

  constructor(
    private httpReqClient: HttpRequestService
  ) { }


  public logout() {
    localStorage.removeItem('access_token');
    localStorage.clear();
    this.httpReqClient.get(this.api_url + "/logout");

  }
}
