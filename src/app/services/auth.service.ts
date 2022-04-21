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
    const data = this.http.post(this.api_url + "login", login);
    return data;
  }


  setToken(token:string) {
    localStorage.setItem('token', token);
  }

  getToken():any {
    return localStorage.getItem("token");
  }

  // Stocker le profil 
  setProfil(profil:boolean) {
    localStorage.setItem('profil', JSON.stringify(profil));
  }
  
  // Stocker les infos sur l'utilisateur
  setUtilisateur(user:string) {
    localStorage.setItem('utilisateur', user);
  }

  isAdmin():any {
    return JSON.parse(localStorage.getItem("profil") || '{}');
  }

  isLoggedIn() {
    return this.getToken() != null;
  }

}
