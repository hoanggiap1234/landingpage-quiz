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
import { ModalManager } from 'ngb-modal';
import { NgModel } from '@angular/forms';

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
  remainingTime: any;

  @ViewChild('myModal') myModal: any;
  private modalRef: any;

  isQuized = false;
  timeLeft : any

  private highlighted: boolean = false
  questions: IQuestion[] = [];
  questionNo: number = 0;
  isDisabled = false;
  time: number | undefined;
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
    private highlightService: HighLightService,
    private quizService: QuizService,
    private router: Router,
    private modalService: ModalManager,
    @Inject(DOCUMENT) document: Document
    ) {}

  ngOnInit(): void {
  
    // this.questions = this.quizService.getQuestions()
   
    if(localStorage.getItem('userId') != 'null' && localStorage.getItem('userId') != null ){
      alert("B???n c???n tho??t tr?????c khi l??m l???i b??i")
      this.router.navigate(['quiz/result'])
    }
   
    var jsonQuestion = localStorage.getItem('questions');
    if(jsonQuestion =='undefined'|| jsonQuestion == null){
      this.callQuestion();
    }else{     
      this.questions = JSON.parse(jsonQuestion);
    }
    // if(jsonQuestion != undefined)
    // this.questions = JSON.parse(jsonQuestion);

    var seconds = new Date().getTime();
    const time_stop = localStorage.getItem('time_stop');
    if(time_stop != null){
      this.time = (parseFloat(time_stop) - seconds)/1000
    }
   
    
    this.checkLoginUser();
    // if(localStorage.getItem('timeLocal')==='started'){
    //   alert("B???n kh??ng th??? reset th???i gian l??m b??i")
    //   this.time = this.countdownTime;
    // }
    // localStorage.setItem('timeLocal', 'started');
    
   
    // this.quizService.getQuestion().subscribe((data) => {
    //   this.questions = data;
    //   // console.log(data);
      
    //   data.forEach((item: IQuestion) => {
    //     item.review = false;
    //     item.answerDTOS.forEach((element: any) => {
    //       element['status'] = false;
         
    //     });
    //   });
    // });    
    // this.setColorBackgroundMatrixCell();
    // this.filColorReviewAfterRefresh()
    // this.callQuestion()
    // let jsonQuestion = localStorage.getItem('questions');
    // if(jsonQuestion != undefined)
    // this.questions = JSON.parse(jsonQuestion);
    
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

  checkClickOption(question: IQuestion) {
    // Khi refresh trang , n???u b???n ???? checked ??? option n??o th?? s??? g???i l???i ????? l???y l???i tr???ng th??i c???a n??,
    // kh??ng reset l???i tr???ng th??i false cho option ???? checked
    const className = '.id' + question.id;
    let check = false
    for (let i = 0; i < question.answerDTOS.length; i++) {
      if (question.answerDTOS[i].status == true) {
        check = true;
      }
    }
    return check;
  }

  filColorReviewAfterRefresh() {
    this.questions.forEach(question => {
      const className = 'id' + question.id;
      if (question.review == true) {
        this.optionElement.nativeElement.querySelector(className).classList().add('cell_review');
      }else{
        this.optionElement.nativeElement.querySelector(className).classList().remove('cell_review'); 
      }
    })

  }

  setColorBackgroundMatrixCell(){
    // debugger
    // console.log(this.questions);
    
    this.questions.forEach( question => {
    
      question.answerDTOS.forEach(option => {
        console.log(question.id);
        // let elements = document.getElementsByClassName(question.id);
        // console.log(elements);
        // elements.classList.add("mystyle");
        const className = '.id' + question.id;
        console.log(this.optionElement.nativeElement.querySelectorAll(className));
        
        this.optionElement.nativeElement.querySelectorAll(className).forEach(
          (cauhoi: any) => {
            let check = false
            for( let i = 0; i < question.answerDTOS.length; i++){ 
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
      })
    })
  }

  // Ki???m tra xem ng?????i d??ng ???? nh???p th??ng tin ch??a
  // N???u ch??a nh???p th??ng tin s??? quay v??? trang ????ng nh???p th??ng tin
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
    // window.location.reload();
    this.setColorToMatrixQuestionsAfterRefresh();
  
  }


  handleEventCountDown($event :any) {
    // this.timeLeft= $event.left;
    // console.log(this.timeLeft);
    this.countdownTime = $event.left;
    if ($event.left === 0) {
      this.isDisabled = true;
     this.onTimerFinished()
      // submit and redirect to result
      this.submitResultTest();
    }
   
  }

  onTimerFinished() {
      alert("H???t th???i gian, h??? th???ng s??? t??? ?????ng hi???n th??? k???t qu??? l??m b??i");
  }


  onNotify(event : Event) {
    console.log(this.countdown.left);
    this.remainingTime = this.countdown.left;

    this.store();
  }


  store(){
    let key = 'Timer';
    localStorage.setItem(key, this.remainingTime);
  }

 

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll()
      // this.highlighted = true
    }
  
  }
// add viewchid ????? set color cho matran c??u h???i
  // add viewchid ????? set color cho matran c??u h???i
  @ViewChild('elmoption')
  optionElement!: ElementRef;

  @ViewChild('elmreview')
  reviewElement!: ElementRef;

  onClickChecBox(option: any, question: any) {
    
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
    //  set color to matrix cell
    const questionId = question.id;
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
    localStorage.setItem('questions', JSON.stringify(this.questions))
   
  }

  onClickedReviewCheckbox(questionNo: any, questionParam: any) {
    this.questions.forEach((question) => {
      if (question.id == questionParam.id) {
        if (question.review == true)
          question.review = false;
        else
          question.review = true;
      }
    });

    const questionId = questionParam.id;
    const className = '.id' + questionId;
    const reviewID = '.review' + questionNo;

    if (this.reviewElement.nativeElement.querySelector(reviewID).checked === true) {
      this.optionElement.nativeElement.querySelector(className).classList.remove('cell_review');
      this.optionElement.nativeElement.querySelector(className).classList.add('cell_review');
    }
    if (this.reviewElement.nativeElement.querySelector(reviewID).checked === false) {
      this.optionElement.nativeElement.querySelector(className).classList.remove('cell_review');
    }
    // luu lai thay doi cuar questions sau khi refresh
    localStorage.setItem('questions', JSON.stringify(this.questions))
  }
 
  nextQuestion() {
    if (this.questionNo == this.questions.length - 1) {
      this.questionNo = this.questions.length - 1;
    } else {
      this.questionNo++;
    }
    console.log(this.questions[this.questionNo]);
  }

  previousQuestion() {
    if (this.questionNo == 0) {
      this.questionNo = 0;
    } else {
      this.questionNo--;
    }
    console.log(this.questions[this.questionNo]);
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
    // alert('H???t th???i gian l??m b??i');
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
    this.closeModal()
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
          // localStorage.setItem('questions', JSON.stringify(this.questions));
          // this.redirectToResultTest(id)
          this.quizService.getResultTest(resp);
          this.router.navigate(['/quiz/result']);
        }else{
          this.resetQuiz();
          alert("B???n ch??a th???c hi???n b??i thi, b???n c???n ????ng nh???p l???i ????? l??m b??i")
          this.router.navigate(['']);
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

  openModal(){
    this.checkvQuized()
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

  
  closeModal(){
    this.modalService.close(this.modalRef);
    //or this.modalRef.close();
}

checkvQuized(){
  this.questions.forEach(question => {
    question.answerDTOS.forEach(  answer => {
      if(answer.status == true)
      this.isQuized = true;
      return;
    })
  })
}


setColorToMatrixQuestionsAfterRefresh(){

  for(let i=0; i< this.questions.length; i++){
    const className = '.id' + this.questions[i].id;
    if(this.questions[i].review === true){
      this.optionElement.nativeElement.querySelector(className).classList.remove('cell_review');
      this.optionElement.nativeElement.querySelector(className).classList.add('cell_review');
    }
      for( let j=0;j<this.questions[i].answerDTOS.length; j++){
        if(this.questions[i].answerDTOS[j].status === true){
          this.optionElement.nativeElement.querySelector(className).classList.remove('cellChecked');
          this.optionElement.nativeElement.querySelector(className).classList.add('cellChecked');
        }
      }
   
  }
}
}
