import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserModule } from '../model/user';
import { UserService } from '../service/user.service';
import { ModalManager } from 'ngb-modal';
import { QuizService } from '../service/quiz.service';
import { IQuestion } from '../model/question';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';

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

  questions!: IQuestion[];

  @ViewChild('myModal') myModal: any;
  private modalRef: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: ModalManager,
    private quizService: QuizService,
    ){}
 
    startQuiz(){
      // this.callQuestion()
      var seconds = new Date().getTime();
      localStorage.setItem('questions', JSON.stringify(this.questions));
      this.router.navigate(['/quiz'])
      this.closeModal()
      let time_stop = seconds + 60000
      localStorage.setItem('time_stop', time_stop.toString())
      this.userService.setUser(this.user);
      sessionStorage.setItem('user',JSON.stringify(this.user));
    }

  ngOnInit(): void {
    console.log(localStorage.getItem('userId'));
    
  }

  setDataFromFormToModel(){ 
    this.user = {
      name: this.userForm.get(['name'])?.value,
      email: this.userForm.get(['email'])?.value,
      phone: this.userForm.get(['phone'])?.value,
    }
  } 


  async callQuestion(){
  this.quizService.getQuestion().subscribe(async  (data) => {
    this.questions = data;
    this.quizService.setQuestion(this.questions);
     // console.log(data);
     data.forEach((item: IQuestion) => {
       item.review = false;
       item.answerDTOS.forEach((element: any) => {
         element['status'] = false;

       });
     });
       localStorage.setItem('questions', JSON.stringify(this.questions));
   }); 
  }

  openModal(){
    this.setDataFromFormToModel();
    this.modalRef = this.modalService.open(this.myModal, {
        size: "md",
        modalClass: 'mymodal',
        hideCloseButton: false,
        centered: false,
        backdrop: true,
        animation: true,
        keyboard: false,
        closeOnOutsideClick: false,
        backdropClass: "modal-backdrop"
    })
}
resetForm(){
  this.userForm.patchValue({
    name: '',
    email: '',
    phone: ''
  })
}
closeModal(){
    this.modalService.close(this.modalRef);
    //or this.modalRef.close();
}

}
