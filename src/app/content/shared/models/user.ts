export class User {
  constructor(public login: string,
              public email: string,
              public password: string,
              public name: string,
              public id?: number,
  ) {

  }
}
