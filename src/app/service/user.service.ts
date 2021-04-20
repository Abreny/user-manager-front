import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface User {
  email: string;
  nom: string;
  prenom: string;
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserList {
  total: number;
  users: User[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  GET_ALL = `${environment.API_URL}/users`;

  constructor(private http:HttpClient) { }

  getAll(queries: any = {}) {
    return this.http.get<UserList>(this.GET_ALL, {
      params: queries
    });
  }
  create(user: any = {}) {
    let data = new FormData();
    data.append('user[nom]', user.nom)
    data.append('user[prenom]', user.prenom)
    data.append('user[email]', user.email)
    return this.http.post<User>(this.GET_ALL, data);
  }
  update(id: number, user: any = {}) {
    let data = new FormData();
    data.append('user[nom]', user.nom)
    data.append('user[prenom]', user.prenom)
    data.append('user[email]', user.email)
    return this.http.post<User>(`${this.GET_ALL}/${id}`, data);
  }
}
