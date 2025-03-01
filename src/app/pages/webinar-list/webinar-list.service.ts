import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class WebinarService {
  //private apiUrl = 'https://dev.api.tirwintalent.com/api/webinars';
  private apiUrl = "http://localhost:3000/api/webinars";

  constructor(private http: HttpClient) {}

  getWebinars(stype: string): Observable<any[]> {
    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //   return new Observable(observer => observer.error('No token found'));
    // }

    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.apiUrl=this.apiUrl+"/"+stype;
    return this.http.get<any[]>(this.apiUrl);
  }
}