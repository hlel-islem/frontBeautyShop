import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesCommandesService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/commandes';

  constructor() {}

  // 🔹 On récupère les commandes d’un utilisateur avec le total déjà calculé en base
  getMesCommandes(utilisateurId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
}
