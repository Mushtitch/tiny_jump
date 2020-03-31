import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from '../models/player.model';
import {map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {FileInput} from 'ngx-material-file-input';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private readonly apiUrl = environment.apiUrl;
  private playerUrl = this.apiUrl + 'players';

  constructor(private http: HttpClient) {
  }

  // Retourne tous les joueurs
  getPlayers(): Observable<Player[]> {
    return this.http.get<Observable<any>>(this.playerUrl)
      .pipe(
        tap((rep: any) => console.log(rep.data)),
        map(rep => {
          return rep.data.map(x => Player.parse(x));
        })
      );
  }


  getPlayer(id: number): Observable<Player> {
    const url = `${this.playerUrl}/${id} `;
    return this.http.get<Observable<{}>>(url)
      .pipe(
        tap((rep: any) => console.log(rep)),
        map(p => Player.parse(p.data)),
      );
  }


  updatePlayer(player: Player, file: FileInput, pwd: string): Observable<Player> {
    const url = `${this.playerUrl}/${player.id} `;
    const formData: FormData = new FormData();
    formData.append('nom', player.nom);
    formData.append('prenom', player.prenom);
    formData.append('email', player.user.email);
    if (pwd) {
      formData.append('password', pwd);
    }
    formData.append('_method', 'PUT');
    if (file) {
      formData.append('avatar', file.files[0], file.fileNames);
    }
    return this.http.post<Observable<Player>>(url, formData)
      .pipe(
        tap((rep: any) => console.log(rep)),
        map(p => Player.parse(p.data)),
      );
  }
}
