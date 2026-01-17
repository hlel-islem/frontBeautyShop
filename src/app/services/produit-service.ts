import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProduitService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/produits';

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addProduit(produit: any) {
    return this.http.post(this.apiUrl, produit);
  }

  updateProduit(id: number, produit: any) {
    return this.http.put(`${this.apiUrl}/${id}`, produit);
  }

  deleteProduit(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
