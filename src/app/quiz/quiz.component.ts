import { Component, HostListener, OnInit } from '@angular/core';
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
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
   
  htmlContent: string = `<pre><code class=\"language-typescript\">import { Injectable, Inject } from '@angular/core';\nimport { PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\nimport 'clipboard';\nimport 'prismjs';\nimport 'prismjs/plugins/toolbar/prism-toolbar';\nimport  'prismjs/components/prism-typescript';\nimport 'prismjs/components/prism-sass';\nimport 'prismjs/components/prism-scss';\ndeclare var Prism: any;\n\n@Injectable()\nexport class HighlightService {\n  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }\n  highlightAll() {\n    if (isPlatformBrowser(this.platformId)) {\n      Prism.highlightAll();\n    }\n  }\n}\n</code></pre>`;

  private highlighted: boolean = false
  questions: IQuestion[] = [];
  questionNo!: number;
  isDisabled = false;

  constructor(
    private highlightService: HighLightService
    ,private quizService: QuizService
    ) {

  }
  ngOnInit(): void {
    this.questionNo = 0;
    this.quizService.getQuestion().subscribe((data) => {
      this.questions = data;
      data.forEach((item: IQuestion) => {
        item.answerDTOS.forEach((element : any) => {
          element['status'] = false;
        });
      });
    });
  }

  ngAfterViewChecked() {
    if (!this.highlighted) {
      this.highlightService.highlightAll()
      this.highlighted = true
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

}
