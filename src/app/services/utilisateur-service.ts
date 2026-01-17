import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  api = 'http://localhost:8081/utilisateurs';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  create(user: any) {
  return this.http.post(this.api, user, {
    headers: { 'Content-Type': 'application/json' }
  });
}


  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
