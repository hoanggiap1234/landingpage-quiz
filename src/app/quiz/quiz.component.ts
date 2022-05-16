import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { catchError, map } from 'rxjs';
import { IQuestion } from '../model/question';
import { ItestResult, TestResult } from '../model/test-result';
import { UserModule } from '../model/user';
import { HighLightService } from '../service/high-light.service';
import { QuizService } from '../service/quiz.service';
import { UserService } from '../service/user.service';

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
   
  htmlContent: string = "<pre><code class=\"language-java\"><p>public&nbsp;class&nbsp;Main {&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;private&nbsp;int i = 1;&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;public&nbsp;static&nbsp;void main(String argv[]) {&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; int i = 2;&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Main s =&nbsp;new&nbsp;Main();&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; s.someMethod();&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;public&nbsp;static&nbsp;void someMethod(){&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; System.out.println(i);&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p>\n  <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;}&nbsp;</p></code></pre>";

  @ViewChild('countdown', { static: false })
  private countdown!: CountdownComponent;

  private highlighted: boolean = false
  questions: IQuestion[] = [];
  questionNo!: number;
  isDisabled = false;
  time: number = 100;
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
 

  constructor(
    private highlightService: HighLightService
    ,private quizService: QuizService,
    private userService: UserService,
    private router: Router
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
    this.user = JSON.parse(jsonUser!.toString());
    if(this.user === undefined || this.user === null ){
      this.router.navigate([''])
    }
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
      alert("Time's up, mate")
    }
    // if(localStorage.getItem('timeLocal') == 'started' ){
    //   console.log($event.left);
      
    //   this.time = $event.left
    // }
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

  onClickChecBox(item: any) {
    this.questions.forEach((element) => {
      element.answerDTOS.forEach((record) => {
        if (record.status == false) {
          if (record.id == item.id) {
            record.status = true;
          }
        } else {
          if (record.id == item.id) {
            record.status = false;
          }
        }
      });
    });
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
    if (event.keyCode === KEY_CODE.UP_ARROW) {
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
    }
  }

  closeExamp(event: any) {
    console.log(event);
    // console.log('is close quiz, canot click option');
    // this.isDisabled = true;
    // alert('Hết thời gian làm bài');
  }

  submitResultTest(){
    console.log(this.questions);
    
    console.log("is submit result test");
  
    this.questions.forEach((element) => {
      element.answerDTOS.forEach((record) => {
        if (record.status == true) {
           this.listAnswerId.push(record.id)
        }
      });
    });

    this.resultTest.email = this.user.email;
    this.resultTest.mobile = this.user.phone;
    this.resultTest.answerIDs =  this.listAnswerId;

    console.log(this.resultTest);
    this.quizService.postTestResult(this.resultTest).pipe(
      map(resp => resp),
      catchError(err => {
        throw err;
      })
    )
      .subscribe(
        resp => {
          console.log(resp)
          localStorage.setItem('userId',resp);
        },
        
        err => console.log(err)
      );

      this.redirectToResultTest()
  }

  redirectToResultTest(){
    const id = localStorage.getItem('userId');
    console.log(id);
    if (id != null)
    this.quizService.getResultTest(id);
    this.router.navigate(['/result']);
  }
  

}
