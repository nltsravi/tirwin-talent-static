import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerRegisterService {
  private registerUrl = 'https://dev.api.tirwintalent.com/api/users/trainer-onbaording';

  constructor(private http: HttpClient) {}

  registerTrainer(trainerData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.registerUrl, trainerData, { headers });
  }
}