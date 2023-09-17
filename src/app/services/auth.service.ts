import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLogin, UserRegister } from '../models/user.iterface';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api';

export interface TokenApiResponse{
  accessToken:string;
  refreshToken:string;
}
export interface userPayload {
  unique_name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private userPayload: userPayload = {
    unique_name: '',
    role: ''
  };


  constructor(private http: HttpClient, private route: Router,) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: UserRegister): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    )
  }

  login(userObj: UserLogin): Observable<TokenApiResponse> {
    return this.http.post<TokenApiResponse>(`${this.baseUrl}/authenticate`, userObj).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    )
  }

  signOut() {
    localStorage.clear();
    this.route.navigate(['login']);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue)
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log("getToken token", token)
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken() {
    return this.userPayload ? this.userPayload.unique_name : '';
  }

  setFullNameFromToken(name: string) {
    this.userPayload.unique_name = name;
  }

  getRoleFromToken() {
    return this.userPayload ? this.userPayload.role : '';
  }

  renewToken(tokenApi : TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  }
}
