import { Component, OnInit } from '@angular/core';
import {LogoutService} from "../services/logout.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor( private logOut: LogoutService,
               private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.logOut.logout();
    this.router.navigate(['/']);

  }
}
