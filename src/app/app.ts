import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('front-BeautyShop');

  constructor(private router: Router) {}

  // 🔐 utilisateur connecté ?
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  // 👑 admin ?
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  // 🚪 déconnexion
  logout(): void {
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  this.router.navigate(['/categories']); // redirige vers client
}

}
