import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PanierService } from '../../services/panier-service';

@Component({
  selector: 'app-finaliser-commande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finaliser-commande.html',
  styleUrls: ['./finaliser-commande.css']
})
export class FinaliserCommandeComponent implements OnInit {

  panier: any = { lignesPanier: [], total: 0 };
  utilisateurId: number | null = null;

  panierService = inject(PanierService);
  router = inject(Router);

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.utilisateurId = userId ? Number(userId) : null;

    if (!this.utilisateurId) {
      alert("Vous devez vous connecter pour finaliser la commande");
      this.router.navigate(['/auth'], { queryParams: { redirect: 'finaliser' } });
      return;
    }

    // Charger le panier local pour affichage
    const local = localStorage.getItem('panierFinaliser');
    if (local) {
      this.panier = JSON.parse(local);
    }
  }

  confirmerCommande() {
    if (!this.panier?.lignesPanier?.length) {
      alert("Votre panier est vide !");
      return;
    }

    if (!this.utilisateurId) {
      alert("Vous devez vous connecter pour confirmer la commande");
      this.router.navigate(['/auth'], { queryParams: { redirect: 'finaliser' } });
      return;
    }

    // 🔹 Récupérer le panier côté serveur pour avoir l'ID correct
    this.panierService.getByUtilisateur(this.utilisateurId).subscribe({
      next: (panierServeur) => {
        this.panier.id = panierServeur.id;

        // 🔹 Confirmer la commande côté serveur
        this.panierService.commanderPanier(this.panier.id).subscribe({
          next: (commandeConfirmée) => {
            alert(`Commande confirmée avec succès ! Total : ${commandeConfirmée.total} DT`);
            localStorage.removeItem('panier');
            localStorage.removeItem('panierFinaliser');
            this.router.navigate(['/categories']);
          },
          error: err => {
            console.error(err);
            alert(err.error?.message || "Erreur lors de la confirmation de la commande");
          }
        });
      },
      error: err => {
        console.error(err);
        alert("Impossible de récupérer le panier serveur");
      }
    });
  }
}
