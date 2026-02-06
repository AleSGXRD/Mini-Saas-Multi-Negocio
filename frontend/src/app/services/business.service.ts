import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plan } from '../model/enum/plan.enum';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }

  getBusinesses(){
    return this.http.get<string>(`${environment.SERVER_URL}/business`);
  }

  createBusiness(data: {
    name: string;
    plan: Plan;
  }){
    return this.http.post<any>(`${environment.SERVER_URL}/business`, data);
  }
}
