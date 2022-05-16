import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ItestResult } from '../model/test-result';
@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:9090/api/public/questions';

  constructor(private http: HttpClient) {  }

  getQuestion(): Observable<any>{
    return this.http.get<any>(this.url);
  }

  postTestResult(resultTest: ItestResult): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    return this.http.post<any>('http://localhost:9090/api/public/test', resultTest, { 'headers': headers, responseType: 'json' })
  }

  getResultTest(id: string): Observable<any>{
    return this.http.get<any>('http://localhost:9090/api/public/test-result/statistic?userId=2db7c60d-cad7-4e08-bb52-1440d1fcd143');
  }

  // signUp(data: {}) {
  //   return this.http.post(this.baseUrl + '/blog/api/user/', data).pipe(
  //     map(resp => resp),
  //     catchError(err => {
  //       throw err;
  //     })
  // )}
}
