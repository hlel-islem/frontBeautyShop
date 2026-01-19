import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommandeService {

  private http = inject(HttpClient);
  private api = 'http://localhost:8081/commandes';

  // ✅ Récupérer toutes les commandes de l'utilisateur connecté
  getByUtilisateur(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/utilisateur/${userId}`);
  }

  // ✅ Récupérer panier EN_ATTENTE de l'utilisateur
  getPanierEnAttente(userId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/utilisateur/${userId}/en-attente`);
  }

  // ✅ Valider panier (si nécessaire)
  validerPanier(panierId: number) {
    return this.http.put(`${this.api}/${panierId}/valider`, {});
  }

  getAll(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/all`);
}

validerCommandeAdmin(id: number) {
  return this.http.put(
    `${this.api}/admin/valider/${id}`,
    {}
  );
}


}