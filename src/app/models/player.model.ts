import {User} from './user.model';

export class Player {
  id: number;
  nom: string;
  prenom: string;
  actif: boolean;
  avatar?: string;
  user: User;

  constructor(id: number, nom: string, prenom: string, actif: boolean, avatar: string, user: User) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.actif = actif;
    this.avatar = avatar;
    this.user = user;
  }

  static parse(personne: any) {
    const user = User.parse(personne);
    console.log('User : ', user);
    return new Player(personne.id, personne.nom,
      personne.prenom,
      personne.actif,
      personne.avatar,
      user);
  }
}

