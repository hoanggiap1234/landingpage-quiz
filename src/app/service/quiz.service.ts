import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ItestResult } from '../model/test-result';
import { IQuestion } from '../model/question';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  questions! : IQuestion[];

  url = 'http://localhost:9090/api/public/questions';

  constructor(private http: HttpClient) {  }

  getQuestion(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  setQuestion(questions: any[]){
         this.questions = questions
  }
  getQuestions(){
    return this.questions;
}

  postTestResult(resultTest: ItestResult): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post<any>('http://localhost:9090/api/public/test', resultTest, { 'headers': headers, responseType: 'json' })
  }

  getResultTest(id: string): Observable<any>{
    return this.http.get<any>('http://localhost:9090/api/public/test-result/statistic?userId='+id);
  }
  
}
