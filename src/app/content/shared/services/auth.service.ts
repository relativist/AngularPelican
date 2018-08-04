import {User} from '../models/user';

export class AuthService {

  private isAuthenticated = false;
  user: User;

  constructor() {
    const u = JSON.parse(window.localStorage.getItem('user'));
    if (u !== null) {
      this.user = u;
    }
  }


  login(u: User) {
    this.user = u;
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
    window.localStorage.clear();
  }

  isLoggedIn(): boolean {
    console.log('isLoggedIn');
    return this.user !== null && this.user !== undefined;
  }
}
