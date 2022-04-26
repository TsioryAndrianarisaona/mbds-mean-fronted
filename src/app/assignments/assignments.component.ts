
import { Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NoterAssignmentPopupComponent } from './noter-assignment-popup/noter-assignment-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { Router } from '@angular/router';
import { LogoutService } from '../services/logout.service';


export interface DialogData {
  assignment: Assignment;
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[] = [];
  assignmentsRendus:Assignment[] = [];
  assignmentsNonRendus:Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];


  utilisateur: any;
  matieres!: any[];
  matiereSearch: string = "";

  // pagination
  page = {
    all : 1,
    rendus : 1,
    nonRendus : 1
  };
  limit=10;
  totalData = {
    all : 0,
    rendus : 0,
    nonRendus : 0
  };
  totalPages={
    all : 0,
    rendus : 0,
    nonRendus : 0
  };
  pagingCounter={
    all : 0,
    rendus : 0,
    nonRendus : 0
  };
  hasPrevPage={
    all : false,
    rendus : false,
    nonRendus : false
  };
  hasNextPage={
    all : false,
    rendus : false,
    nonRendus : false
  };
  prevPage= {
    all : 1,
    rendus : 1,
    nonRendus : 1
  };
  nextPage= {
    all : 2,
    rendus : 2,
    nonRendus : 2
  };

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone, public dialog: MatDialog, 
    private snackbar: MatSnackBar, private router: Router, private logOut: LogoutService) {}

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage");
    this.getAssignments();
    this.getAssignmentsNonRendus();
    this.getAssignmentsRendus();
    this.getUtilisateur();
    this.getMatieres();
    console.log(this.hasNextPage)
  }



  getUtilisateur(){
    let utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    this.utilisateur = utilisateur;
  }

  getMatieres(){
    let matieres = JSON.parse(localStorage.getItem('matieres') || '{}');
    this.matieres = matieres;
  }

  getAssignments() {
      // demander les données au service de gestion des assignments...
      this.assignmentsService.getAssignments(this.page.all, this.limit, [0, 10, 20], "")
      .subscribe(reponse => {
        this.page.all = reponse.data.page;
        this.limit=reponse.data.limit;
        this.totalData.all = reponse.data.total
        this.totalPages.all= (reponse.data.total / reponse.data.limit);
        this.hasPrevPage.all = (reponse.data.page == 1 ) ? false : true;
        this.hasNextPage.all = (reponse.data.page < this.totalPages.all ) ? true : false;
        this.prevPage.all = reponse.data.page - 1;
        this.nextPage.all = reponse.data.page + 1;
      });

      console.log("Après l'appel au service");
  }

  getAssignmentsRendus(){
    
    this.assignmentsService.getAssignments(this.page.rendus, this.limit, [20], this.matiereSearch)
    .subscribe(reponse => {
      this.assignmentsRendus = reponse.data.assignments;
      this.page.rendus = reponse.data.page;
      this.totalData.rendus = reponse.data.total
      this.totalPages.rendus= (reponse.data.total / reponse.data.limit);
      this.hasPrevPage.rendus = (reponse.data.page == 1 ) ? false : true;
      this.hasNextPage.rendus = (reponse.data.page < this.totalPages.rendus ) ? true : false;
      this.prevPage.rendus = reponse.data.page - 1;
      this.nextPage.rendus = reponse.data.page + 1;
    });
  }

  getAssignmentsNonRendus(){
      
    this.assignmentsService.getAssignments(this.page.nonRendus, this.limit,[0, 10], this.matiereSearch)
    .subscribe(reponse => {
      console.log("assignments non rendus : données arrivées");
      this.assignmentsNonRendus = reponse.data.assignments;
      this.page.nonRendus = reponse.data.page;
      this.totalData.nonRendus = reponse.data.total
      this.totalPages.nonRendus= (reponse.data.total / reponse.data.limit);
      this.hasPrevPage.nonRendus = (reponse.data.page == 1 ) ? false : true;
      this.hasNextPage.nonRendus = (reponse.data.page < this.totalPages.nonRendus ) ? true : false;
      this.prevPage.nonRendus = reponse.data.page - 1;
      this.nextPage.nonRendus = reponse.data.page + 1;
    });

  }

  search(){
    this.getAssignmentsNonRendus();
    this.getAssignmentsRendus();
  }

  pagePrecedenteRendus() {
    this.page.rendus--;
    this.getAssignmentsRendus();
  }

  pageSuivanteRendus() {
    this.page.rendus++;
    this.getAssignmentsRendus();
  }

  
  pagePrecedenteNonRendus() {
    this.page.nonRendus--;
    this.getAssignmentsNonRendus();
  }

  pageSuivanteNonRendus() {
    this.page.nonRendus++;
    this.getAssignmentsNonRendus();
  }


  // Rendre un devoir ( drag and drop feature)
  rendre(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      var assignment = event.previousContainer.data[event.previousIndex];

      const dialogRef = this.dialog.open(NoterAssignmentPopupComponent, {
        data: {
          assignment: assignment,
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        const body = {
          _id : assignment._id,
          note : result.note,
          remarques : result.remarques
        }
  
        console.log('body', body)
  
        this.assignmentsService.updateAssignment(body).subscribe({
          next: response => {
            
            transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
            );
          },
          error: err => {
            var messageDErreur = err.message;
            this.messageSnackBar(messageDErreur, "OK")
          }
        })  
  
      });
      
    }
  }

  messageSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }

  voirDetails(assignment: Assignment){
    const dialogRef = this.dialog.open(AssignmentDetailComponent, {
      width: "75%",
      height: "75%",
      data: {
        assignment: assignment,
      },
    });
  }

  addAssignment(){
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      width: "75%",
      height: "75%"
    });
  }

  logout() {
    this.logOut.logout();
    this.router.navigate(['/']);
  }

}
