import {Component, OnInit} from '@angular/core';
import {Message} from '../content/shared/models/message';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../content/shared/services/user-service';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from '../content/shared/models/user';
import {AuthService} from '../content/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message: Message;
  form: FormGroup;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta) {
    title.setTitle('Entrance');
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
    this.route.queryParams.subscribe((params: Params) => {
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
      'password': new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit() {
    const {login, password} = this.form.value;
    this.userService.getUserByLogin(login)
      .subscribe((u: User) => {
        if (u && u[0]) {
          const user = u[0];
          if (user.password === password) {
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.router.navigate(['/content', 'dashboard']);
          } else {
            this.showMessage({
              text: 'Incorrect password',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'No such user!',
            type: 'danger'
          });
        }
      });
  }

}
