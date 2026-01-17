import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PanierService } from '../../services/panier-service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier.html'
})
export class PanierComponent implements OnInit {

  panier: any = { lignesPanier: [] };
  router = inject(Router);
  panierService = inject(PanierService);

  ngOnInit(): void {
    const guest = localStorage.getItem('panier');
    this.panier = guest ? JSON.parse(guest) : { lignesPanier: [] };
  }

  getTotal(): number {
    return this.panier?.lignesPanier?.reduce(
      (t: number, l: any) => t + l.produit.prix * l.quantite,
      0
    ) || 0;
  }

  // 🔹 Ajouter produit
  addProduit(produit: any) {
    const ligne = this.panier.lignesPanier.find((l: any) => l.produit.id === produit.id);
    if (ligne) ligne.quantite++;
    else this.panier.lignesPanier.push({ produit, quantite: 1 });

    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  // 🔹 Diminuer produit (comportement classique)
  decreaseProduit(produit: any) {
    const ligne = this.panier.lignesPanier.find((l: any) => l.produit.id === produit.id);
    if (!ligne) return;

    if (ligne.quantite > 1) {
      ligne.quantite--; // Diminue de 1
    } else {
      // Supprimer la ligne si quantité = 1
      this.panier.lignesPanier = this.panier.lignesPanier.filter(
        (l: any) => l.produit.id !== produit.id
      );
    }

    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  // 🔹 Supprimer complètement (optionnel)
  removeProduit(produit: any) {
    this.panier.lignesPanier = this.panier.lignesPanier.filter(
      (l: any) => l.produit.id !== produit.id
    );
    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  commander() {
    if (!this.panier?.lignesPanier?.length) {
      alert("Le panier est vide !");
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
