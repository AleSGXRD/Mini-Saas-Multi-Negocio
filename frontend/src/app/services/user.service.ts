import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getMe(){
    return this.httpClient.get<string>(`${environment.SERVER_URL}/auth/me`);
  }
}
