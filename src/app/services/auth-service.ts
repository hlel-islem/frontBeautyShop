import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private api = 'http://localhost:8081/auth';
  private Uapi = 'http://localhost:8081/utilisateurs';
  
  register(data: any) {
  return this.http.post(`${this.Uapi}/register`, data);
}



  login(email: string, password: string) {
  const payload = { email, motDePasse: password }; // 🔹 motDePasse correspond à l'entité Spring
  return this.http.post(`${this.api}/login`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
 }




  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }
}
