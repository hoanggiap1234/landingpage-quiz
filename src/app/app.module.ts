import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';
import { HighLightService } from './service/high-light.service';
import { QuizService } from './service/quiz.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { ResultTestComponent } from './result-test/result-test.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    HomeComponent,
    TimerComponent,
    ResultTestComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CountdownModule ,
    ReactiveFormsModule
  ],
  providers:  [HttpClientModule, FormBuilder,HighLightService, QuizService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
  ]
})
export class AppModule { }
