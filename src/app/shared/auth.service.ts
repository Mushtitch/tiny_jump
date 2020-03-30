import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Player} from '../models/player.model';
import {map, tap} from 'rxjs/operators';

// Setup headers
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private registerUrl = this.apiUrl + 'register';
  private loginUrl = this.apiUrl + 'login';
  private currentUserSubject: BehaviorSubject<Player>;
  public currentUser: Observable<Player>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Player>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Player {
    return this.currentUserSubject.value;
  }

  onLogin(user: any): Observable<{} | Player> {
    const request = JSON.stringify({email: user.email, password: user.password});
    const url = this.loginUrl;
    return this.http.post(this.loginUrl, request, httpOptions)
      .pipe(
        tap(data => {
          console.log('le retour', data);
        }),
        map((data: any) => {
          const personne = Player.parse(data.data.player);
          this.storeToken(data, personne);
          return personne;
        }));
  }

  storeToken(data: any, player: Player) {
    player.user.accessToken = data.data.token;
    localStorage.setItem('currentUser', JSON.stringify(player));
    console.log('Personne : ', player);
    this.currentUserSubject.next(player);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  onRegister(valeur: { player: Player, pwd: string }) {
    const request = JSON.stringify({
      nom: valeur.player.nom, prenom: valeur.player.prenom, name: valeur.player.user.name,
      email: valeur.player.user.email, password: valeur.pwd
    });

    return this.http.post(this.registerUrl, request, httpOptions)
      .pipe(
        tap(data => {
          console.log('le retour du register', data);
        }),
        map((data: any) => {
          const player = Player.parse(data.data.player);
          this.storeToken(data, player);
          return player;
        }));
  }
}
