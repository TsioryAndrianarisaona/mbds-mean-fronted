import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
              private router: Router,
              private auth: AuthService
              ) {
                  this.loginForm = new FormGroup({
                    userName: new FormControl(),
                    password: new FormControl()
                  });
                }

  ngOnInit(): void {
    this.router.navigate(['./home']);
  }

  loginForm: FormGroup;
  errorUtilisateur: string = "";
  checkErrorUser: boolean = false;

  login() {
    this.errorUtilisateur = "";
    this.checkErrorUser = false;
    const userLog = {
      'email': this.loginForm.value.userName,
      'password': this.loginForm.value.password
    }
    console.log(userLog);

    this.auth.login(userLog).subscribe({
      next: res => {
        // @ts-ignore
        this.auth.setToken(res.token);
        // @ts-ignore
        this.auth.setProfil(res.user.isAdmin);
        // @ts-ignore
        this.auth.setUtilisateur(JSON.stringify(res.user));

        // Stocker les matières associés à l'utilisateur
        // @ts-ignore
        localStorage.setItem('matieres', JSON.stringify(res.matiere));
      },
      error: () => {
        this.errorUtilisateur = "Login ou mot de passe incorrect";
        this.checkErrorUser = true;

      },
      complete: () => {
        this.router.navigate(['./home']);
      }
    }) 
  }
}
