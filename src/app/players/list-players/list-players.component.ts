import { Component, OnInit } from '@angular/core';
import {Player} from '../../models/player.model';
import {Router} from '@angular/router';
import {PlayersService} from '../players.service';

@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.css']
})
export class ListPlayersComponent implements OnInit {
  loading = false;
  players: Player[];
  selectedPlayer: Player;
  displayedColumns: string[] = ['nom', 'prenom'];

  constructor(private router: Router, private service: PlayersService) { }

  ngOnInit() {
    this.loading = true;
    this.service.getPlayers().subscribe(players => {
      this.players = players;
      this.loading = false;
    });  }

  selectedRow(player: Player) {
    if (this.isSelected(player)) {
      this.selectedPlayer = null;
    } else {
      this.selectedPlayer = player;
      this.router.navigate(['./players', this.selectedPlayer.id]);
    }
  }

  isSelected(player: Player) {
    return this.selectedPlayer != null && this.selectedPlayer.id === player.id;
  }

}
