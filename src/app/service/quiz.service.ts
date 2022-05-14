import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:9090/api/public/questions';

  constructor(private http: HttpClient) {  }

  getQuestion(): Observable<any>{
    return this.http.get<any>(this.url);
  }
}
