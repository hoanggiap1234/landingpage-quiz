import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultTestComponent } from './quiz/result-test/result-test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'quiz',
    loadChildren:  () => import('./quiz/quiz.module').then(m => m.QuizModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
