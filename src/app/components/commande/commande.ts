import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../services/commande-service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commande.html',
})
export class CommandeComponent implements OnInit {

  commandes: any[] = [];
  loading = true; // pour indiquer le chargement
  errorMessage = ''; // pour afficher les erreurs
  private commandeService = inject(CommandeService);

  ngOnInit(): void {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    // 🔹 Lister toutes les commandes
    this.commandeService.getAll().subscribe({
      next: res => {
        this.commandes = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = "Impossible de charger les commandes";
        this.loading = false;
      }
    });
    return;
  }

  // 🔹 Utilisateur normal
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) {
    this.errorMessage = "Utilisateur non connecté";
    this.loading = false;
    return;
  }

  this.commandeService.getByUtilisateur(userId).subscribe({
    next: res => {
      this.commandes = res;
      this.loading = false;
    },
    error: err => {
      console.error(err);
      this.errorMessage = "Impossible de charger les commandes";
      this.loading = false;
    }
  });
}


  trackById(index: number, item: any) {
    return item.id;
  }
}
