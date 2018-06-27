import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../content/shared/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    const loggedIn = this.authService.isLoggedIn();
    if (loggedIn) {
      this.router.navigate(['/content', 'dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
