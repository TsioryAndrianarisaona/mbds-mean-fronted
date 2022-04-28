import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";
import { AssignmentsComponent } from './assignments/assignments.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children : [
      {
        path:"home",
        component: AssignmentsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
