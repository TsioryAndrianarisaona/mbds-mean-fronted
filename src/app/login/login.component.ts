import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
              private router: Router,
              private auth: AuthService,
              private formBuilder: FormBuilder
              ) {
                  this.loginForm = new FormGroup({
                    userName: new FormControl(),
                    password: new FormControl()
                  });
                }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['./home']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // loginForm = new FormGroup({
  //   userName: new FormControl(),
  //   password: new FormControl()
  // })

  loginForm: FormGroup;
  errorUtilisateur: string = "";
  checkErrorUser: boolean = false;

  login() {
    this.errorUtilisateur = "";
    this.checkErrorUser = false;
    const userLog = {
      'username': this.loginForm.value.userName,
      'password': this.loginForm.value.password
    }
    this.auth.login(userLog).subscribe({
      next: res => {
        // @ts-ignore
        this.auth.setToken(res.access_token);
      },
      error: () => {
        this.errorUtilisateur = "Username ou mot de passe incorrecte";
        this.checkErrorUser = true;

      },
      complete: () => {
        this.router.navigate(['./home']);
      }
    })
  }
}
