import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/categories';

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCategory(category: any) {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(id: number, category: any) {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ Nouvelle méthode pour récupérer les produits par catégorie
  getProductsByCategory(categoryId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${categoryId}/products`);
  }
}

