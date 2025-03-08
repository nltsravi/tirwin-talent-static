import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class WebinarService {
  private apiUrl = 'https://dev.api.tirwintalent.com/api/webinars';

  constructor(private http: HttpClient) {}

  getWebinars(stype: string): Observable<any[]> {
    const url=`${environment.api}/webinars/${stype}`;
    return this.http.get<any[]>(url);
  }
}