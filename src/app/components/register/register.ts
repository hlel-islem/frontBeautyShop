import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { PanierService } from '../../services/panier-service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  errorMessage = '';

  authService = inject(AuthService);
  panierService = inject(PanierService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  register() {
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    this.authService.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.password
    }).subscribe({
      next: (user: any) => {
        // 🔹 Stocker userId
        localStorage.setItem('userId', user.id);
        localStorage.setItem('role', user.role);
        const local = localStorage.getItem('panier');
        if (!local) {
          // Pas de panier local, redirection directe
          this.router.navigate(['/finaliser']);
          return;
        }

        const localPanier = JSON.parse(local);

        // 🔹 Stocker le panier local pour affichage final
        localStorage.setItem('panierFinaliser', JSON.stringify(localPanier));

        // 🔹 Fusionner chaque produit dans le panier serveur
        const requests: Observable<any>[] = [];
        localPanier.lignesPanier.forEach((ligne: any) => {
          for (let i = 0; i < ligne.quantite; i++) {
            requests.push(this.panierService.addProduit(user.id, ligne.produit.id));
          }
        });

        forkJoin(requests).subscribe({
          next: () => {
            // 🔹 Ne pas supprimer encore panierFinaliser pour affichage
            localStorage.removeItem('panier'); // vider le panier local temporaire
            this.router.navigate(['/finaliser']); // redirection
          },
          error: err => {
            console.error("Erreur fusion panier", err);
            // Même en cas d'erreur, on peut afficher le panier local pour finaliser
            this.router.navigate(['/finaliser']);
          }
        });
      },
      error: () => this.errorMessage = "Erreur lors de l’inscription"
    });
  }
}
