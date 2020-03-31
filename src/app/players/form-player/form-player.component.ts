import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayersService} from '../players.service';
import {FileInput, FileValidator} from 'ngx-material-file-input';
import {Player} from '../../models/player.model';
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'app-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['./form-player.component.css']
})
export class FormPlayerComponent implements OnInit {
  @Input() player: Player;
  @Output() updatedPlayer: EventEmitter<{player: Player, avatar: FileInput, pwd: string}>;
  aAccept = '.png, .jpg, .jpeg';
  editForm: FormGroup;
  maxSize = 300000;
  error: any;
  pageTitle: string;
  action: string;
  avatarFile: any = undefined;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private service: PlayersService) {
    this.updatedPlayer = new EventEmitter<{player: Player, avatar: FileInput, pwd: string}>();
  }


  createForm() {
    this.editForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormGroup({
          password: new FormControl(undefined, Validators.compose([Validators.minLength(4)])),
          confirmPassword: new FormControl(undefined)
        }
      ),
      image: new FormControl(null, [FileValidator.maxContentSize(this.maxSize)])
    });
  }

  get accept() {
    return this.aAccept;
  }

  get password() {
    return this.editForm.get('pwd').get('password');
  }

  get confirmPassword() {
    return this.editForm.get('pwd').get('confirmPassword');
  }

  get image() {
    return this.editForm.get('image');
  }

  get nom() {
    return this.editForm.get('nom');
  }

  get prenom() {
    return this.editForm.get('prenom');
  }

  get email() {
    return this.editForm.get('email');
  }

  ngOnInit() {
    this.createForm();

    const id = this.player.id;
    if (id === -1) {
      this.pageTitle = 'Enregistrement d\'un joueur';
      this.action = 'create';
    } else {
      this.action = 'edit';
      this.pageTitle = 'Édition d\'un joueur';
      this.fillForm();
    }

    console.log('Action: ', this.action);

  }

  avatarLocal(file: FileInput) {
    console.log('file : ', file);
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarFile = reader.result;
    };
    reader.readAsDataURL(file.files[0]);
  }

  fillForm() {
    this.editForm.patchValue({
      nom: this.player.nom,
      prenom: this.player.prenom,
      email: this.player.user.email,
    });
  }

  onSubmit() {
    let pwd;
    let avatar: FileInput;
    this.player.nom = this.nom.value;
    this.player.prenom = this.prenom.value;
    this.player.user.email = this.email.value;
    if (this.password.value) {
      pwd = this.password.value;
    }
    if (this.password.value) {
      pwd = this.password.value;
    }
    if (this.image) {
      avatar = this.image.value;
    }
    this.updatedPlayer.emit({
      player: this.player,
      avatar,
      pwd
    });
  }
}
