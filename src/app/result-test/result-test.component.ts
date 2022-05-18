import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuestion } from '../model/question';
import { HighLightService } from '../service/high-light.service';
import { QuizService } from '../service/quiz.service';
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  SPACE_ARROW = 32
}

@Component({
  selector: 'app-result-test',
  templateUrl: './result-test.component.html',
  styleUrls: ['./result-test.component.scss']
})
export class ResultTestComponent implements OnInit {

  questions!: IQuestion[];
  resultTest : any
  questionNo = 0;
  private highlighted: boolean = false
  constructor(
    private quizService : QuizService,
    private highlightService : HighLightService,
    private router : Router
  ) { }

  ngOnInit(): void {

    const user = sessionStorage.getItem('user');
    if(user == null || user == undefined){
      this.router.navigate(['']);
    }
    const id = localStorage.getItem('userId');
    // if(id == null || id == undefined){
    //   this.router.navigate(['/quiz']);
    // }
    const jsonQuestion = localStorage.getItem('questions')
    
    if (jsonQuestion != null)
      this.questions = JSON.parse(jsonQuestion);
    console.log(this.questions);
    if (id != null) {
      console.log(id);
      this.quizService.getResultTest(id).subscribe(data => {
        this.resultTest = data;
        console.log(this.resultTest);
      });
    }
    
  }

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll()
      // this.highlighted = true
    }
  }

  resetQuiz(){
    localStorage.removeItem('questions');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('user')
    localStorage.clear();
    this.router.navigate(['']);
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

  checkCellChecked(question : IQuestion) : Boolean{
    let check = false;
    for( let i=0; i< question.answerDTOS.length; i++){
      if(question.answerDTOS[i].status == true){
        check = true;
        break;
      }
    }
    return check;
  }

}
