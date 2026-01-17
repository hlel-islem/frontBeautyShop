import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MesCommandesService } from '../../services/mes-commandes-service';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-commandes.html'
})
export class MesCommandesComponent implements OnInit {

  commandes: any[] = [];
  selectedCommande: any = null;
  utilisateurId!: number;

  private mesCommandesService = inject(MesCommandesService);
  private router = inject(Router);

  ngOnInit(): void {
    const id = localStorage.getItem('userId');

    if (!id) {
      this.router.navigate(['/auth']);
      return;
    }

    this.utilisateurId = Number(id);
    this.loadMesCommandes();
  }

  loadMesCommandes() {
    this.mesCommandesService.getMesCommandes(this.utilisateurId).subscribe({
      next: res => {
        // ✅ On récupère exactement ce qui est en base
        this.commandes = res;
      },
      error: () => alert("Erreur chargement commandes")
    });
  }

  voirProduits(commande: any) {
    this.selectedCommande = commande;
  }

  fermerDetails() {
    this.selectedCommande = null;
  }
}
