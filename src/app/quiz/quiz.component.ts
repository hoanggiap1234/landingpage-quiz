import { DOCUMENT } from '@angular/common';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { catchError, map } from 'rxjs';
import { IQuestion } from '../model/question';
import { ItestResult, TestResult } from '../model/test-result';
import { UserModule } from '../model/user';
import { HighLightService } from '../service/high-light.service';
import { QuizService } from '../service/quiz.service';
import { UserService } from '../service/user.service';
import * as $ from 'jquery'

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  SPACE_ARROW = 32
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
   
  // htmlContent: string = "<pre><code class=\"language-java\"><p>public&nbsp;class&nbsp;Main {&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;private&nbsp;int i = 1;&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;public&nbsp;static&nbsp;void main(String argv[]) {&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; int i = 2;&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Main s =&nbsp;new&nbsp;Main();&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; s.someMethod();&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;public&nbsp;static&nbsp;void someMethod(){&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; System.out.println(i);&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p></code></pre>";

  @ViewChild('countdown', { static: false })
  private countdown!: CountdownComponent;

  private highlighted: boolean = false
  questions: IQuestion[] = [];
  questionNo!: number;
  isDisabled = false;
  time: number = 180;
  countdownTime: number = 0;
  user: UserModule.IUser = {
    name: '',
    email: '',
    phone: ''
  };
  resultTest: ItestResult = {
    email: '',
    mobile: '',
    answerIDs: []
  };
  listAnswerId: string[] = [];
  hightlight = 'check-option'

  constructor(
    private highlightService: HighLightService
    ,private quizService: QuizService,
    private userService: UserService,
    private router: Router,
    private elem: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) document: Document
    ) {

  }
  ngOnInit(): void {
    this.checkLoginUser();
    // if(localStorage.getItem('timeLocal')==='started'){
    //   alert("Bạn không thể reset thời gian làm bài")
    //   this.time = this.countdownTime;
    // }
    // localStorage.setItem('timeLocal', 'started');
    this.questionNo = 0;
    this.quizService.getQuestion().subscribe((data) => {
      this.questions = data;
      // console.log(data);
      
      data.forEach((item: IQuestion) => {
        item.answerDTOS.forEach((element: any) => {
          element['status'] = false;
        });
      });
    });    
  }

  // Kiểm tra xem người dùng đã nhập thông tin chưa
  // Nếu chưa nhập thông tin sẽ quay về trang đăng nhập thông tin
  checkLoginUser(){
    const jsonUser = sessionStorage.getItem('user');
    if(jsonUser == undefined || jsonUser == null ){
      this.router.navigate([''])
    }
    this.user = JSON.parse(jsonUser!.toString());
    
  }

  ngAfterViewInit () {
    // this.countdown.pause();
    // this.countdown.resume();
  }


  handleEventCountDown($event :any) {
    console.log($event.left);
    this.countdownTime = $event.left;
    if ($event.left === 0) {
      this.isDisabled = true;
      alert("Hết thời gian, hệ thống sẽ tự động hiển thị kết quả làm bài");
      // submit and redirect to result
      this.submitResultTest();
    }
   
  }

  onTimerFinished() {
    alert("Time's up, mate")
  }

 

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll()
      // this.highlighted = true
    }
  }
// add viewchid để set color cho matran câu hỏi
  // add viewchid để set color cho matran câu hỏi
  @ViewChild('elmoption')
  optionElement!: ElementRef;

  onClickChecBox(option: any, question: any) {
    const questionId = question.id;
    this.questions.forEach((element) => {
      element.answerDTOS.forEach((record) => {
        if (record.status == false) {
          if (record.id == option.id) {
            record.status = true;
          }
        } else {
          if (record.id == option.id) {
            record.status = false;
          }
        }
      });
    });
    console.log(questionId);
    let elements = document.getElementsByClassName(questionId);
    console.log(elements);
    // elements.classList.add("mystyle");
    const className = '.id' + questionId;
    this.optionElement.nativeElement.querySelectorAll(className).forEach(
      (cauhoi: any) => {

        let check = false

        for( let i = 0; i< question.answerDTOS.length; i++){          
          if(question.answerDTOS[i].status == true){
            check = true;
          }         
        }

        if(check == true ){
          cauhoi.classList.add('cellChecked');
        } else {
          cauhoi.classList.remove('cellChecked');
        }
      }
    )   

   
  }
  isReview = false;
  onCheckedReview(questionNo : any, question : any){
    const questionId = question.id;
    const className = '.id' + questionId;
    const reviewID = '.review'+ questionNo ;
    console.log( );
    // this.optionElement.nativeElement.querySelector(reviewID).forEach((review : any)=>{
    //        console.log("is click review");
           
    // })
    
    this.optionElement.nativeElement.querySelectorAll(className).forEach(
      (cauhoi: any) => {
        cauhoi.classList.remove('cellChecked');
        cauhoi.classList.add('cell_review');
      }
    )   
     
  }


  nextQuestion() {
    if (this.questionNo == this.questions.length - 1) {
      this.questionNo = this.questions.length - 1;
    } else {
      this.questionNo++;
    }
    console.log(this.questionNo);
  }

  previousQuestion() {
    if (this.questionNo == 0) {
      this.questionNo = 0;
    } else {
      this.questionNo--;
    }
  }

  openQuestion(index: number) {
    this.questionNo = index;
    console.log(this.time)
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.nextQuestion();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.previousQuestion();
    }
    // if (event.keyCode === KEY_CODE.UP_ARROW) {
    // }
    // if (event.keyCode === KEY_CODE.DOWN_ARROW) {
    // }
  }

  closeExamp(event: any) {
    console.log(event);
    // console.log('is close quiz, canot click option');
    // this.isDisabled = true;
    // alert('Hết thời gian làm bài');
  }

  submitResultTest() {
    // console.log(this.questions);
    // console.log("is submit result test");
    this.questions.forEach((element) => {
      element.answerDTOS.forEach((record) => {
        if (record.status == true) {
          this.listAnswerId.push(record.id)
        }
      });
    });

    this.resultTest.email = this.user.email;
    this.resultTest.mobile = this.user.phone;
    this.resultTest.answerIDs = this.listAnswerId;

    // console.log(this.resultTest);
    this.callAPIPostDataQuizToDb();
  }

  callAPIPostDataQuizToDb(){
    this.quizService.postTestResult(this.resultTest).pipe(
      map(resp => resp),
      catchError(err => {
        throw err;
      })
    ).subscribe(
      resp => {
        console.log(resp)
        localStorage.setItem('userId', resp);
        if (resp != null) {
          // console.log(id);
          localStorage.setItem('questions', JSON.stringify(this.questions));

          // this.redirectToResultTest(id)
          this.quizService.getResultTest(resp);
          this.router.navigate(['/result']);
        }
      },

      err => console.log(err)
    );
  }

  resetQuiz(){
    localStorage.removeItem('questions');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('user')
    localStorage.clear();
    this.router.navigate(['']);
  }

  
  

}
