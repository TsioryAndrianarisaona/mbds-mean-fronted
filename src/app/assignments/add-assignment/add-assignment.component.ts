
import { Component, Inject, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;
  dateLimite!: Date;
  matieres : any[] = [];
  matiereChoisi!: string;
  note!: string;
  auteur!: string;

  constructor(private assignmentsService:AssignmentsService, 
    private router:Router, 
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<AddAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getMatieres();
    console.log(this.matieres)
  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.dateLimite) || (!this.matiereChoisi) || (!this.auteur)) return;

    let currentDate = new Date()
    console.log(this.dateLimite)
    //Verifier si la date limite est valide
    if( new Date(this.dateLimite) < currentDate){
      // Afficher message d'erreur si la note n'est pas valide
      var messageDErreur = "Veuillez renseigner une date valide";
      this.messageSnackBar(messageDErreur, "OK")
      return;
    }

    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere : '+ this.matiereChoisi
    );
    
    const body = {
      nom : this.nomAssignment,
      dateLimite : new Date(this.dateLimite),
      auteur: this.auteur,
      matiere: this.matiereChoisi
      }
    
    this.assignmentsService.addAssignment(body)
    .subscribe(reponse => {
      this.messageSnackBar(reponse.message, "");
      this.dialogRef.close();
    })
  }


  // Récuperer les matières du prof connecté
  getMatieres(){
    this.matieres = JSON.parse(localStorage.getItem('matieres') || '{}');
  }

  messageSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }
}
