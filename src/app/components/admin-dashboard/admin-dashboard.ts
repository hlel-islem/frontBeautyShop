import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../services/admin-dashboard-service';
import { CommandeService } from '../../services/commande-service';

import { Chart, registerables } from 'chart.js';
import { ProduitService } from '../../services/produit-service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],

})
export class AdminDashboardComponent implements OnInit {

  stats: any = null;
  commandes: any[] = [];
  produits: any[] = [];
  loadingStats = true;
  loadingCommandes = true;
  loadingProduits = true;
  errorMessage = '';
  isAdmin = false;

  private dashboardService = inject(AdminDashboardService);
  private commandeService = inject(CommandeService);
  private produitService = inject(ProduitService);

  @ViewChild('commandesChart') commandesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stockChart') stockChartRef!: ElementRef<HTMLCanvasElement>;


  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';

    if (this.isAdmin) {
      this.loadStats();
      this.loadProduits();
    }

    this.loadCommandes();
  }

  private loadStats() {
    this.dashboardService.getStats().subscribe({
      next: data => {
        this.stats = data;
        this.loadingStats = false;
        this.createCommandesChart();
      },
      error: err => {
        console.error('Erreur dashboard', err);
        this.errorMessage = "Impossible de charger les statistiques";
        this.loadingStats = false;
      }
    });
  }

  private loadCommandes() {
    if (this.isAdmin) {
      this.commandeService.getAll().subscribe({
        next: res => {
          this.commandes = res;
          this.loadingCommandes = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = "Impossible de charger les commandes";
          this.loadingCommandes = false;
        }
      });
      return;
    }

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.errorMessage = "Utilisateur non connecté";
      this.loadingCommandes = false;
      return;
    }

    this.commandeService.getByUtilisateur(userId).subscribe({
      next: res => {
        this.commandes = res;
        this.loadingCommandes = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = "Impossible de charger vos commandes";
        this.loadingCommandes = false;
      }
    });
  }

  private loadProduits() {
    this.produitService.getProduitsStock().subscribe({
      next: data => {
        this.produits = data;
        this.loadingProduits = false;
        this.createStockChart();
      },
      error: err => {
        console.error('Erreur chargement produits', err);
        this.loadingProduits = false;
      }
    });
  }

  createCommandesChart() {
    if (!this.stats || !this.commandesChartRef) return;

    new Chart(this.commandesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['En attente', 'Validées'],
        datasets: [{
          label: 'Nombre de commandes',
          data: [this.stats.enAttente, this.stats.validees],
          backgroundColor: ['#ffc107', '#198754']
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  createStockChart() {
  if (!this.produits || !this.stockChartRef) return;

  new Chart(this.stockChartRef.nativeElement, {
    type: 'bar',
    data: {
      labels: this.produits.map(p => p.nom),
      datasets: [{
        label: 'Stock',
        data: this.produits.map(p => p.stock),
        backgroundColor: this.produits.map(p => 
          p.stock <= 5 ? '#dc3545' : p.stock <= 15 ? '#ffc107' : '#198754'
        )
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });



}


  validerCommande(id: number): void {
    if (!confirm("Valider cette commande ?")) return;

    this.commandeService.validerCommandeAdmin(id).subscribe({
      next: () => {
        const cmd = this.commandes.find(c => c.id === id);
        if (cmd) cmd.statut = 'VALIDEE';
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
