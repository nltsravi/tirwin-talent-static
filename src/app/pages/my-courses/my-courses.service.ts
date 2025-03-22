import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class MyWebinarService {
  constructor(private http: HttpClient) {}

  getWebinars(stype: string): Observable<any[]> {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url=`${environment.api}/webinars/my-webinars/${stype}/${user?.id}`;
      return this.http.get<any[]>(url);      
  }
}