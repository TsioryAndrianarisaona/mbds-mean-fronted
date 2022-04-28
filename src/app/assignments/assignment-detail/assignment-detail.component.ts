import { Component, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis: any = {
    data : {
      assignments : [{
        nom : "",
        dateDeRendu: "",
        rendu : false,
        auteur: "",
        matiere: "",
        note: 0,
        remarques: "",
        etat: 0
      }],
      matiere : [[{
        name : "",
        prof : ""
      }]]
    }

  };

  isAdmin : any = false;
  isEditable = false;

  note !: number ;
  remarques !: Text;
  nomDeDevoir !: string;

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

      this.assignmentTransmis = assignment;
      // @ts-ignore
      let etat = assignment.data.assignments[0].etat;
      switch(etat){
        case 20 :
          this.assignmentTransmis.data.assignments[0].etat = "Rendu";
          break;
        case 10 :
          this.assignmentTransmis.data.assignments[0].etat = "Délivré";
          break;
        case 0 :
          this.assignmentTransmis.data.assignments[0].etat = "Non Rendu";
          break;
      }
      console.log(this.assignmentTransmis)

      this.note = this.assignmentTransmis.data.assignments[0].note;
      this.remarques = this.assignmentTransmis.data.assignments[0].remarques;
      this.nomDeDevoir = this.assignmentTransmis.data.assignments[0].nom;
    });
  }

  enableEdit(){
    this.isEditable = true;
  }

  edit(){

    if(+this.note < 0 || +this.note > 20){
      var messageDErreur = "Veuillez donner une note valide";
      this.messageSnackBar(messageDErreur, "OK");
      return;
    }

    const body = {
      _id : this.data.assignment._id,
      note : this.note,
      remarques: this.remarques,
      nom: this.nomDeDevoir
    }

    console.log(body);
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
        this.dialogRef.close();
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
