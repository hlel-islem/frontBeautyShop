import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {

  private api = 'http://localhost:8081/admin/dashboard';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<any>(`${this.api}/stats`);
  }

  getProduitsStock() {
    return this.http.get<any[]>(`${this.api}/produits-stock`);
  }

}

