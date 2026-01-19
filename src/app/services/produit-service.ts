import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProduitService {

  private http = inject(HttpClient);

  // URL générale pour CRUD produits
  private apiUrl = 'http://localhost:8081/produits';

  // URL spécifique dashboard admin pour le stock
  private apiDashboard = 'http://localhost:8081/admin/dashboard/produits-stock';

  // 🔹 Récupérer tous les produits (CRUD classique)
  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔹 Ajouter un produit
  addProduit(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }

  // 🔹 Mettre à jour un produit
  updateProduit(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // 🔹 Supprimer un produit
  deleteProduit(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer les produits pour le dashboard (avec stock)
  getProduitsStock() {
    return this.http.get<any[]>(this.apiDashboard);
  }
}
