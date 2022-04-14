import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAssignmentComponent } from './../assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './../assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './../assignments/edit-assignment/edit-assignment.component';
import {AuthGuard} from "../guard/auth.guard";
import { AssignmentsComponent } from './../assignments/assignments.component';
import { LayoutComponent } from './../layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: AssignmentsComponent
      },
      {
        path:"add",
        component: AddAssignmentComponent
      },
      {
        path:"assignment/:id",
        component: AssignmentDetailComponent
      },
      {
        path:"assignment/:id/edit",
        component: EditAssignmentComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainContentRoutingModule { }
