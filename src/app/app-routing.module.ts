import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: ()=>
      import('./main-content/main-content.module').then((m)=>m.MainContentModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
