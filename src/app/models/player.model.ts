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
    return new Player(personne.id, personne.nom,
      personne.prenom,
      personne.actif,
      personne.avatar,
      user);
  }

  isAuteur() {
    return this.user.role.indexOf('auteur') > 0;
  }

  isAdmin() {
    return this.user.role.indexOf('admin') > 0;
  }
}

