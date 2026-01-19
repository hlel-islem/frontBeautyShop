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
  loading = true;
  errorMessage = '';
  isAdmin = false;

  private commandeService = inject(CommandeService);

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';

    // 🔹 ADMIN : toutes les commandes
    if (this.isAdmin) {
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

  // 🔹 Validation commande ADMIN
  validerCommande(id: number): void {
    if (!confirm("Valider cette commande ?")) return;

    this.commandeService.validerCommandeAdmin(id).subscribe({
      next: () => {
        const cmd = this.commandes.find(c => c.id === id);
        if (cmd) {
          cmd.statut = 'VALIDEE';
        }
      },
      error: err => {
        console.error(err);
        alert("Erreur lors de la validation de la commande");
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
