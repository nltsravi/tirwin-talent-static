import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerRegisterService {
  private registerUrl = `${environment.api}/users/trainer-onbaording`;

  constructor(private http: HttpClient) {}

  registerTrainer(trainerData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.registerUrl, trainerData, { headers });
  }
}