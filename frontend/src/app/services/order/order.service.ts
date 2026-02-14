import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http : HttpClient) { }

  findMany(){
    return this.http.get<any[]>(`${environment.SERVER_URL}/order`);
  }

  createOrder(name: string){
    return this.http.post(`${environment.SERVER_URL}/order`, { name });
  }
}
