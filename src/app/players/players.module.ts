import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players/players.component';
import {AngularMaterialModule} from '../angular-material.module';
import {RouterModule} from '@angular/router';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { FormPlayerComponent } from './form-player/form-player.component';
import { ListPlayersComponent } from './list-players/list-players.component';
import { DetailsPlayersComponent } from './details-players/details-players.component';
import {PlayersRoutingModule} from './players-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {AuteurGuardService} from '../shared/auteur-guard.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import { DeletePlayerComponent } from './delete-player/delete-player.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    PlayersComponent,
    EditPlayerComponent,
    FormPlayerComponent,
    ListPlayersComponent,
    DetailsPlayersComponent,
    DeletePlayerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlayersRoutingModule,
    FlexLayoutModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MaterialFileInputModule,
    MatDialogModule,
  ],
  providers: [AuteurGuardService],
})
export class PlayersModule { }
