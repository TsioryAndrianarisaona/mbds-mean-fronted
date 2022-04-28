import { Component, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis: Assignment = new Assignment();
  matiere: any = {
    name : "",
    prof : "",
    image : ""
  }

  assignmentT : Assignment = new Assignment();

  isAdmin : any = false;
  isEditable = false;

  constructor(
            private assignmentsService: AssignmentsService,
            private snackbar: MatSnackBar,
            private route: ActivatedRoute,
            private router: Router,
            public dialogRef: MatDialogRef<AssignmentDetailComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
            ) {}


  ngOnInit(): void {
    this.getAssignment(this.data.assignment._id);
    this.isAdmin = JSON.parse(localStorage.getItem('profil') || 'false') ;
  }

  getAssignment(id: string) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {

      // @ts-ignore
      this.assignmentTransmis = assignment.data.assignments[0];
      // @ts-ignore
      this.matiere = assignment.data.matiere[0][0];
      // @ts-ignore
      let etat = this.assignmentTransmis.etat;
      switch(etat){
        case 20 :
          this.assignmentTransmis.etat = "Rendu";
          break;
        case 10 :
          this.assignmentTransmis.etat = "Délivré";
          break;
        case 0 :
          this.assignmentTransmis.etat = "Non Rendu";
          break;
      }
    });
  }

  enableEdit(){
    this.isEditable = true;
  }

  edit(){

    if(+this.assignmentTransmis.note < 0 || +this.assignmentTransmis.note > 20){
      var messageDErreur = "Veuillez donner une note valide";
      this.messageSnackBar(messageDErreur, "OK");
      return;
    }

    const body = {
      _id : this.data.assignment._id,
      note : this.assignmentTransmis.note,
      remarques: this.assignmentTransmis.remarques,
      nom: this.assignmentTransmis.nom
    }

    this.assignmentsService.updateAssignment(body).subscribe({
      next: response => {
        this.messageSnackBar(response.message, "OK")
      },
      error: err => {
        var messageDErreur = err.message;
        this.messageSnackBar(messageDErreur, "OK")
      }
    })  
    this.isEditable = false;
  }

  delete(){
    const body = {
    _id : this.data.assignment._id,
    etat : -20
    }
  
    this.assignmentsService.updateAssignment(body).subscribe({
      next: response => {
        this.messageSnackBar(response.message, "OK")
        this.onNoClick()
      },
      error: err => {
        var messageDErreur = err.message;
        this.messageSnackBar(messageDErreur, "OK")
      }
    })  

  }
  
  cancel(){
    this.isEditable = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  messageSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }

}
