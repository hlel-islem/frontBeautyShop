import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur-service';


@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateur.html'
})
export class UtilisateurComponent implements OnInit {

  utilisateurs: any[] = [];
  username = '';
  password = '';

  service = inject(UtilisateurService);

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.utilisateurs = res);
  }

  add() {
    this.service.create({ nom: this.username, motDePasse: this.password })

      .subscribe(() => {
        this.load();
        this.username = '';
        this.password = '';
      });
  }

  delete(id: number) {
    this.service.delete(id).subscribe(() => this.load());
  }
}
