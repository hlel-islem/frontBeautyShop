import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PanierService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/paniers';

  // Ajouter un produit au panier
  addProduit(utilisateurId: number, produitId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/utilisateur/${utilisateurId}/produit/${produitId}`, {});
  }

  // Récupérer le panier d'un utilisateur
  getByUtilisateur(utilisateurId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/utilisateur/${utilisateurId}`);
  }

  // Supprimer ou réduire un produit
  removeProduit(panierId: number, produitId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${panierId}/produit/${produitId}`);
  }

  // Passer commande
  commanderPanier(panierId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${panierId}/commander`, {});
  }

  

  
}