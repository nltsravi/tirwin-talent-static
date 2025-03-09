import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class WebinarService {
  constructor(private http: HttpClient) {}

  getWebinars(stype: string,tabType:string): Observable<any[]> {
    if(tabType === 'allCourses') {
      const url=`${environment.api}/webinars/${stype}`;
      return this.http.get<any[]>(url);
      }
    else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url=`${environment.api}/webinars/my-webinars/${stype}/${user?.id}`;
      return this.http.get<any[]>(url);
      }
  }
}