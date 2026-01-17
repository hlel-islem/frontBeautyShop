import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { PanierService } from '../../services/panier-service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {

  email = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private panierService = inject(PanierService);
  private router = inject(Router);

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (user: any) => {
        // 🔹 Stocker les infos utilisateur
        localStorage.setItem('userId', user.id);
        localStorage.setItem('role', user.role);

        // 🔹 Redirection selon rôle
        if (user.role === 'ADMIN') {
          this.router.navigate(['/commandes']); // page admin
          return;
        }

        // 🔹 Gestion du panier pour utilisateur normal
        const local = localStorage.getItem('panier');
        if (!local) {
          this.router.navigate(['/finaliser']);
          return;
        }

        const localPanier = JSON.parse(local);

        // 🔹 Stocker pour finalisation (affichage panier final)
        localStorage.setItem('panierFinaliser', JSON.stringify(localPanier));

        // 🔹 Préparer les requêtes de fusion panier
        const requests: Observable<any>[] = [];
        localPanier.lignesPanier.forEach((ligne: any) => {
          for (let i = 0; i < ligne.quantite; i++) {
            requests.push(this.panierService.addProduit(user.id, ligne.produit.id));
          }
        });

        if (requests.length > 0) {
          forkJoin(requests).subscribe({
            next: () => {
              // 🔹 Redirection vers page finalisation
              this.router.navigate(['/finaliser']);
            },
            error: err => {
              console.error("Erreur lors de la fusion du panier:", err);
              this.errorMessage = "Erreur lors de la fusion du panier";
            }
          });
        } else {
          // Aucun produit à fusionner
          this.router.navigate(['/finaliser']);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = "Email ou mot de passe incorrect";
        } else if (err.status === 403) {
          this.errorMessage = "Compte non validé";
        } else {
          this.errorMessage = "Erreur serveur, veuillez réessayer";
        }
      }
    });
  }
}
