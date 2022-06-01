import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';
import { HighLightService } from './service/high-light.service';
import { QuizService } from './service/quiz.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { ResultTestComponent } from './quiz/result-test/result-test.component';
import { StarquizPopupComponent } from './home/starquiz-popup/starquiz-popup.component';
import { ModalModule } from 'ngb-modal';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    HomeComponent,
    TimerComponent,
    ResultTestComponent,
    StarquizPopupComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CountdownModule ,
    ReactiveFormsModule,
    ModalModule,
    FormsModule
  ],
  providers:  [HttpClientModule, FormBuilder,HighLightService, QuizService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
  ]
})
export class AppModule { }
