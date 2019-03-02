import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import { VERSION } from 'environments/version';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  date: Date = new Date();
  user: User;
  version;

  constructor(private as: AuthService,
              private router: Router) {
    this.version = VERSION;
  }

  ngOnInit() {
    this.user = this.as.user;
  }

  onLogout() {
    this.as.logout();

    this.router.navigate(['/login']);
  }

}
