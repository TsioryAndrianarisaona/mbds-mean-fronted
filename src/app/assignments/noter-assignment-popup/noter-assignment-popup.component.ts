import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../assignments.component';

@Component({
  selector: 'app-noter-assignment-popup',
  templateUrl: './noter-assignment-popup.component.html',
  styleUrls: ['./noter-assignment-popup.component.css']
})
export class NoterAssignmentPopupComponent implements OnInit {


  note!: number; 
  remarques!: Text;

  constructor(
              private snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<NoterAssignmentPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData
              ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  confirm() {
    // closing itself and sending data to parent component

    if( +this.note < 0 || +this.note > 20 ){

      // Afficher message d'erreur si la note n'est pas valide
      var messageDErreur = "Veuillez rajouter une note valide";
      this.messageSnackBar(messageDErreur, "OK")
      return;
    }

    this.dialogRef.close({ note: this.note, remarques : this.remarques })
  }

  messageSnackBar(message: string, action: string) {
    this.snackbar.open(message, action);
  }
}
