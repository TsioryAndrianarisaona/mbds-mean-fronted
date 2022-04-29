
import { Component, OnInit} from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './../models/assignment.model';
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
  matieres: any[] = [];
  matiereSearch: string = "";

  isAdmin : any = false;

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

  constructor(private assignmentsService:AssignmentsService,
              public dialog: MatDialog,
              private snackbar: MatSnackBar,
              private router: Router,
              private logOut: LogoutService) {
    this.getUtilisateur();
    this.isAdmin = JSON.parse(localStorage.getItem('profil') || 'false');
    if(this.isAdmin){
        this.getMatieres();
      }
    }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    this.getAssignments();
    this.getAssignmentsNonRendus();
    this.getAssignmentsRendus();
  }

  // Récuperer utilisateur connecté
  getUtilisateur(){
    let utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    this.utilisateur = utilisateur;
  }

  // Récuperer matieres liées au prof connecté
  getMatieres(){
    let matieres = JSON.parse(localStorage.getItem('matieres') || '{}');
    this.matieres = matieres;
  }



  // ------------------------------------------ Assignments ----------------------------------------------- //
  // ----------------------------------------------------------------------------------------------------- //

  // Récupérer tous les assignments
  getAssignments() {
      // demander les données au service de gestion des assignments...
      this.assignmentsService.getAssignments(this.page.all, this.limit, [0, 10, 20], this.matiereSearch !="" ? [this.matiereSearch] : this.matieres.map(matiere => matiere.name))
      .subscribe(reponse => {
        this.assignments = reponse.data.assignments;
        this.page.all = reponse.data.page;
        this.limit=reponse.data.limit;
        this.totalData.all = reponse.data.total
        this.totalPages.all= (reponse.data.total / reponse.data.limit);
        this.hasPrevPage.all = (reponse.data.page == 1 ) ? false : true;
        this.hasNextPage.all = (reponse.data.page < this.totalPages.all ) ? true : false;
        this.prevPage.all = reponse.data.page - 1;
        this.nextPage.all = reponse.data.page + 1;
      });
  }

  // Récuperer les assignments rendus
  getAssignmentsRendus(){

    this.assignmentsService.getAssignments(this.page.rendus, this.limit, [20], this.matiereSearch!="" ? [this.matiereSearch] : this.matieres.map(matiere => matiere.name))
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

  // Récuperer les assignments non rendus
  getAssignmentsNonRendus(){

    this.assignmentsService.getAssignments(this.page.nonRendus, this.limit,[0, 10], this.matiereSearch!="" ? [this.matiereSearch] : this.matieres.map(matiere => matiere.name))
    .subscribe(reponse => {
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

  // Rechercher assignments par matière
  search(){
    this.getAssignmentsNonRendus();
    this.getAssignmentsRendus();
  }

  // Voir details d'un assignment
  voirDetails(assignment: Assignment){
    const dialogRef = this.dialog.open(AssignmentDetailComponent, {
      width: "75%",
      height: "85%",
      data: {
        assignment: assignment,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
    });

  }

  // Ajouter assignment
  addAssignment(){
    const dialogRef = this.dialog.open(AddAssignmentComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  // ------------------------------------------ Assignments ----------------------------------------------- //
  // ----------------------------------------------------------------------------------------------------- //



  // ------------------------------------------ Pagination ------------------------------------------------ //
  // ----------------------------------------------------------------------------------------------------- //

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

  pagePrecedenteAll() {
    this.page.all--;
    this.getAssignments();
  }

  pageSuivanteAll() {
    this.page.all++;
    this.getAssignments();
  }

  // ------------------------------------------ Pagination ------------------------------------------------ //
  // ----------------------------------------------------------------------------------------------------- //

  // Rendre un devoir ( drag and drop feature)
  rendre(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
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

        this.assignmentsService.updateAssignment(body).subscribe({
          next: response => {

            transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
            );

            // Set date de rendu to today's datae
            event.container.data[event.currentIndex].dateDeRendu = new Date();
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

  // Se déconnecter
  logout() {
    this.logOut.logout();
    this.router.navigate(['/']);
  }


  // Formattage
  getEtat(etat:number){
    var etatFinal = "non rendu";
    switch(etat){
      case 20:
        etatFinal = "noté"
        break
      case 10:
        etatFinal = "délivré"
        break
      case -20:
        etatFinal = "supprimé"
        break
    }

    return etatFinal;
  }

  getEtatClass(etat:number){
    var etatFinal = "status status--in-work";
    switch(etat){
      case 20:
        etatFinal = "status status--noted"
        break
      case 10:
        etatFinal = "status status--delivered"
        break
      case -20:
        etatFinal = "status status--deleted"
        break
    }

    return etatFinal;
  }
}
