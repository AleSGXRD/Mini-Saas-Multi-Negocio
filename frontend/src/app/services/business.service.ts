import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plan } from '../model/enum/plan.enum';
import { environment } from '../../environment/environment';
import { Business } from '../model/business.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }

  getBusinesses(){
    return this.http.get<Business[]>(`${environment.SERVER_URL}/business`);
  }

  getCurrentBusiness(){
    return this.http.get<Business>(`${environment.SERVER_URL}/business/current`);
  }

  createBusiness(data: {
    name: string;
    plan: Plan;
  }){
    return this.http.post<any>(`${environment.SERVER_URL}/business`, data);
  }

  getCheckoutUrl(publicId:string){
    return this.http.get<any>(`${environment.SERVER_URL}/business/${publicId}`)
  }
}
