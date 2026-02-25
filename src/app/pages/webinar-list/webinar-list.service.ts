import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class WebinarService {
  constructor(private http: HttpClient) { }

  getWebinars(stype: string, tabType: string): Observable<any[]> {
    if (tabType === 'allCourses') {
      const url = `assets/api-data/webinars.json`;
      return this.http.get<any[]>(url);
    }
    else {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      const url = `assets/api-data/webinars_my.json`;
      return this.http.get<any[]>(url);
    }
  }
}