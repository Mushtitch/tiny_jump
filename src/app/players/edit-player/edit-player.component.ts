import { Component, OnInit } from '@angular/core';
import {Player} from '../../models/player.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayersService} from '../players.service';
import {FileInput} from 'ngx-material-file-input';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css']
})
export class EditPlayerComponent implements OnInit {

  loading = false;
  player: Player = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: PlayersService) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.service.getPlayer(id).subscribe(player => {
      this.player = player;
      this.loading = false;
    });
  }

  update($event: {player: Player, avatar: FileInput, pwd: string}) {
    this.service.updatePlayer($event.player, $event.avatar, $event.pwd).subscribe(player => {
      this.router.navigate(['./players', this.player.id]);
    });
  }

}
