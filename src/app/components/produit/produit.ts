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

  produit: any = {
    id: 0,
    nom: '',
    prix: 0,
    imageUrl: ''
  };

  selectedFile: File | null = null;
  isEdit = false;

  role = localStorage.getItem('role'); // ADMIN ou CLIENT

  private produitService = inject(ProduitService);
  private panierService = inject(PanierService);

  ngOnInit(): void {
    this.loadProduits();
  }

  // 🔐 ROLE
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  // 📦 LOAD PRODUITS
  loadProduits(): void {
    this.produitService.getAll()
      .subscribe(data => this.produits = data);
  }

  // 📸 IMAGE SELECTION (admin)
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // 💾 SAVE / UPDATE PRODUIT
  saveProduit(): void {
    if (!this.isAdmin()) return;

    const formData = new FormData();
    formData.append('nom', this.produit.nom);
    formData.append('prix', this.produit.prix);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEdit) {
      this.produitService.updateProduit(this.produit.id, formData)
        .subscribe(() => {
          this.loadProduits();
          this.resetForm();
        });
    } else {
      this.produitService.addProduit(formData)
        .subscribe(() => {
          this.loadProduits();
          this.resetForm();
        });
    }
  }

  // ✏️ EDIT PRODUIT
  editProduit(p: any): void {
    if (!this.isAdmin()) return;
    this.produit = { ...p };
    this.isEdit = true;
  }

  // ❌ DELETE PRODUIT
  deleteProduit(id: number): void {
    if (!this.isAdmin()) return;
    this.produitService.deleteProduit(id)
      .subscribe(() => this.loadProduits());
  }

  // 🔄 RESET FORMULAIRE
  resetForm(): void {
    this.produit = { id: 0, nom: '', prix: 0, imageUrl: '' };
    this.selectedFile = null;
    this.isEdit = false;
  }

  // 🛒 AJOUTER AU PANIER (client)
  addToPanier(p: any): void {
    if (this.isAdmin()) return;

    let panier = localStorage.getItem('panier');
    let panierObj = panier ? JSON.parse(panier) : { lignesPanier: [] };

    const ligne = panierObj.lignesPanier
      .find((l: any) => l.produit.id === p.id);

    if (ligne) ligne.quantite++;
    else panierObj.lignesPanier.push({ produit: p, quantite: 1 });

    localStorage.setItem('panier', JSON.stringify(panierObj));
    alert(`${p.nom} ajouté au panier 🛒`);
  }

  // 🔗 IMAGE DU PRODUIT (par id)
  getImage(p: any): string {
  return p.imageUrl
    ? `http://localhost:8081/uploads/${p.imageUrl}`
    : `http://localhost:8081/uploads/default.png`;
}





  // ❌ IMAGE PAR DÉFAUT SI NON TROUVÉE
  onImageError(event: any): void {
    event.target.src = 'assets/produits/default.png';
  }

}
