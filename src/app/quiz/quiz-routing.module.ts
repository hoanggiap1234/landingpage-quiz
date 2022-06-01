import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { ResultTestComponent } from './result-test/result-test.component';

const routes: Routes = [
  { path: '', component: QuizComponent },
  { path: 'result', component: ResultTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
