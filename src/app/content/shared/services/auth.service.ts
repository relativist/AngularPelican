export class AuthService {

  private isAuthenticated = false;

  constructor() {
  }


  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
    window.localStorage.clear();
  }

  isLoggedIn(): boolean {
    console.log('isLoggedIn');
    const user = JSON.parse(window.localStorage.getItem('user'));
    return user !== null;
  }
}
