import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserModule } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user!: UserModule.IUser;
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required,Validators.email, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['',[Validators.required, Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})')]]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
    ){}
 
    startQuiz(){
    this.setDataFromFormToModel();
    this.router.navigate(['/quiz'])
  }

  ngOnInit(): void {
  }

  setDataFromFormToModel(){
    this.user = {
      name: this.userForm.get(['name'])?.value,
      email: this.userForm.get(['email'])?.value,
      phone: this.userForm.get(['phone'])?.value,
    }
    this.userService.setUser(this.user);
    sessionStorage.setItem('user',JSON.stringify(this.user));
  }

}
