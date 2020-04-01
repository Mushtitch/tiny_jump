import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Player} from '../../models/player.model';

@Component({
  selector: 'app-delete-player',
  templateUrl: './delete-player.component.html',
  styleUrls: ['./delete-player.component.css']
})
export class DeletePlayerComponent implements OnInit {

  player: Player;

  constructor(public dialogRef: MatDialogRef<DeletePlayerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {nom: string, prenom: string}) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
