import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  router = inject(Router);
  authService = inject(AuthService);

  // Redirection vers login
  login() {
    this.router.navigate(['/auth'], { queryParams: { redirect: 'finaliser' } });
  }

  // Redirection vers inscription
  register() {
    this.router.navigate(['/register'], { queryParams: { redirect: 'finaliser' } });
  }
}
