import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuestion } from '../model/question';
import { HighLightService } from '../service/high-light.service';
import { QuizService } from '../service/quiz.service';

@Component({
  selector: 'app-result-test',
  templateUrl: './result-test.component.html',
  styleUrls: ['./result-test.component.scss']
})
export class ResultTestComponent implements OnInit {

  questions!: IQuestion[];
  resultTest : any
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

}
