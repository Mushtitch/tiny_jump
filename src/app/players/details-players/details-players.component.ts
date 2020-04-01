import {Component, Inject, OnInit} from '@angular/core';
import {Player} from '../../models/player.model';
import {PlayersService} from '../players.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '../../dialog/dialog.component';
import {AuthService} from '../../shared/auth.service';
import {DeletePlayerComponent} from "../delete-player/delete-player.component";

@Component({
  selector: 'app-players-details',
  templateUrl: './details-players.component.html',
  styleUrls: ['./details-players.component.css']
})
export class DetailsPlayersComponent implements OnInit {
  loading: boolean = false;
  player: Player;
  currentUser: Player;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: PlayersService,
              private dialog: MatDialog,
              private authenticationService: AuthService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.service.getPlayer(id).subscribe(rep => {
        console.log(rep);
        this.player = rep;
        this.loading = false;
      },
      error => {
        this.loading = false;

        this.errorDialog('Impossible de charger le joueur');
      });
  }

  editPlayer() {
    this.router.navigate(['./players/edit', this.player.id]);
  }

  errorDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {text: message}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['players', 'liste']);

      return;
    });
  }

  delete() {
    const dialogRef = this.dialog.open(DeletePlayerComponent, {
      width: '500px',
      data: {
        nom: this.player.nom,
        prenom: this.player.prenom,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Suppression validée');

        this.loading = true;
        this.service.deletePlayer(this.player).subscribe(player => {
          this.loading = false;
        });

        return;
      }

      console.log('Suppression annulée');
      return;
    });
  }
}
