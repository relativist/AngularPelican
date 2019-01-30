import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Message} from '../content/shared/models/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../content/shared/services/user-service';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from '../content/shared/models/user';
import {AuthService} from '../content/shared/services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {fadeStateTrigger} from '../content/shared/animations/fade.animation';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeStateTrigger]
})
export class RegisterComponent implements OnInit, OnDestroy {

  @HostBinding('@fade') a = true;
  message: Message;
  form: FormGroup;
  sub1: Subscription;
  sub2: Subscription;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta) {
    title.setTitle('Register');
    meta.addTags([
      {name: 'keywords', content: 'login, entrance, system'},
      {name: 'description', content: 'page for system entrance'},
    ]);
  }

  private showMessage(message: Message) {
    this.message = message;
    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  ngOnInit() {
    this.message = new Message('danger', '');
    this.sub1 = this.route.queryParams.subscribe((params: Params) => {
      if (params['accessDenied']) {
        this.showMessage({
            text: 'You need login!',
            type: 'danger'
          }
        );
      }
    });

    this.form = new FormGroup({
      'login': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'mail': new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmit() {

    const {login, password, name, mail} = this.form.value;
    this.userService.getUserByLogin(login)
      .mergeMap((u: User) => {
        if (u && u[0]) {
          this.showMessage({
            text: 'Login has already exists!',
            type: 'danger'
          });
          return null;
        } else {
          const user = new User(login, mail, password, name);
          return this.userService.addUser(user);
        }
      }).subscribe((user: User) => {
      if (user && user.login) {
        this.message.text = '';
        window.localStorage.setItem('user', JSON.stringify(user));
        this.authService.login(user);
        this.router.navigate(['/content', 'dashboard']);
      }
    });
  }

  goBack() {

    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }

    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }


}
