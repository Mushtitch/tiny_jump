import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../shared/auth-guard.service';
import {ListPlayersComponent} from './list-players/list-players.component';
import {PlayersComponent} from './players/players.component';
import {EditPlayerComponent} from './edit-player/edit-player.component';
import {AuteurGuardService} from '../shared/auteur-guard.service';
import {DetailsPlayersComponent} from './details-players/details-players.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';

const playersRoutes: Routes = [
  {
    path: 'players',
    component: PlayersComponent,
    canActivate: [AuthGuardService],
    children: [
      {path: 'liste', component: ListPlayersComponent},
      {path: ':id', component: DetailsPlayersComponent, canActivateChild: [AuteurGuardService]},
      {path: 'edit/:id', component: EditPlayerComponent, canActivateChild: [AuthGuardService]},
    ]
  },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(playersRoutes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule {
}
