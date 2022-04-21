
import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;
  matieres : any[] = [];
  matiereChoisi!: string;
  note!: string;
  auteur!: string;

  constructor(private assignmentsService:AssignmentsService, private router:Router, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.getMatieres();
    console.log(this.matieres)
  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.dateDeRendu) || (!this.matiereChoisi) || (!this.auteur)) return;


    //Verifier si la note est valide
    if( Number(this.note) < 0 || Number(this.note) > 20 ){

      // Afficher message d'erreur si la note n'est pas valide
      var messageDErreur = "Veuillez rajouter une note valide";
      this.messageSnackBar(messageDErreur, "OK")
      return;
    }

    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere : '+ this.matiereChoisi + ' note : '+this.note
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.note = (this.note == null) ? this.note : Number(this.note);
    newAssignment.auteur = this.auteur;
    newAssignment.matiere = this.matiereChoisi;
    newAssignment.rendu = (this.note == null) ? false : true;


    console.log(newAssignment);
    
    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
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
