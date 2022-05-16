import { Injectable } from '@angular/core';
import { UserModule } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user!: UserModule.IUser;

  constructor() { }

  setUser( p_user: any){
    this.user = p_user;
  }

  getUser(): UserModule.IUser{
    return this.user;
  }

}
