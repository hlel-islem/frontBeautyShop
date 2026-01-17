import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit-service';
import { PanierService } from '../../services/panier-service';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit.html',
  styleUrls: ['./produit.css']
})
export class ProduitComponent implements OnInit {

  produits: any[] = [];
  produit = { id: 0, nom: '', prix: 0 };
  isEdit = false;

  role = localStorage.getItem('role'); // ADMIN ou CLIENT

  private produitService = inject(ProduitService);
  private panierService = inject(PanierService);

  ngOnInit(): void {
    this.loadProduits();
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  loadProduits(): void {
    this.produitService.getAll().subscribe(data => this.produits = data);
  }

  saveProduit(): void {
    if (!this.isAdmin()) return; // sécurité côté client
    if (!this.produit.nom.trim()) return;

    if (this.isEdit) {
      this.produitService.updateProduit(this.produit.id, this.produit)
        .subscribe(() => { this.loadProduits(); this.resetForm(); });
    } else {
      this.produitService.addProduit(this.produit)
        .subscribe(() => { this.loadProduits(); this.resetForm(); });
    }
  }

  editProduit(p: any): void {
    if (!this.isAdmin()) return;
    this.produit = JSON.parse(JSON.stringify(p));
    this.isEdit = true;
  }

  deleteProduit(id: number): void {
    if (!this.isAdmin()) return;
    this.produitService.deleteProduit(id)
      .subscribe(() => this.loadProduits());
  }

  resetForm(): void {
    this.produit = { id: 0, nom: '', prix: 0 };
    this.isEdit = false;
  }

  // 🛒 AJOUTER AU PANIER (client seulement)
  addToPanier(p: any): void {
    if (this.isAdmin()) return; // admin ne fait pas de panier
    let panier = localStorage.getItem('panier');
    let panierObj = panier ? JSON.parse(panier) : { lignesPanier: [] };

    const ligne = panierObj.lignesPanier.find((l: any) => l.produit.id === p.id);
    if (ligne) ligne.quantite++;
    else panierObj.lignesPanier.push({ produit: p, quantite: 1 });

    localStorage.setItem('panier', JSON.stringify(panierObj));
    alert(`${p.nom} ajouté au panier !`);
  }

}
