
import { Component, Inject, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  matiereChoisi: any = {
    id : "",
    name : "",
    image: "",
    prof : ""
  };
  note!: string;
  auteur!: string;

  // Stepper
  matiereFormGroup!: FormGroup;
  nomAssignmentFormGroup!: FormGroup;
  dateFormGroup!: FormGroup;
  auteurFormGroup!: FormGroup;

  constructor(
                private assignmentsService:AssignmentsService,
                private snackbar: MatSnackBar,
                private _formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<AddAssignmentComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any
              ) {}

  ngOnInit(): void {
    this.matiereFormGroup = this._formBuilder.group({
      matiereCtrl: ['', Validators.required],
    });
    this.nomAssignmentFormGroup = this._formBuilder.group({
      nomAssignmentCtrl: ['', Validators.required],
    });
    this.dateFormGroup = this._formBuilder.group({
      dateCtrl: ['', Validators.required],
    });
    this.auteurFormGroup = this._formBuilder.group({
      auteurCtrl: ['', Validators.required],
    });
    this.getMatieres();
  }

  ajouter() {
    if((!this.nomAssignment) || (!this.dateLimite) || (!this.matiereChoisi.name) || (!this.auteur)) return;

    let currentDate = new Date()
    //Verifier si la date limite est valide
    if( new Date(this.dateLimite) < currentDate){
      // Afficher message d'erreur si la note n'est pas valide
      var messageDErreur = "Veuillez renseigner une date valide";
      this.messageSnackBar(messageDErreur, "OK")
      return;
    }
    
    const body = {
      nom : this.nomAssignment,
      dateLimite : new Date(this.dateLimite),
      auteur: this.auteur,
      matiere: this.matiereChoisi.name,
      remarques: null
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
    this.snackbar.open(message, action, {duration: 2000});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
