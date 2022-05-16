import { Component, OnInit } from '@angular/core';
import { HighLightService } from '../service/high-light.service';
import { QuizService } from '../service/quiz.service';

@Component({
  selector: 'app-result-test',
  templateUrl: './result-test.component.html',
  styleUrls: ['./result-test.component.scss']
})
export class ResultTestComponent implements OnInit {

  resultTest : any
  private highlighted: boolean = false
  constructor(
    private quizService : QuizService,
    private highlightService : HighLightService
  ) { }

  ngOnInit(): void {
   
    const id = localStorage.getItem('userId');
    if (id != null) {
      console.log(id);
      this.quizService.getResultTest(id).subscribe(data=>{
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

}
