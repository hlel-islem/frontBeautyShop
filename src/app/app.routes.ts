import { Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category';
import { ProduitComponent } from './components/produit/produit';
import { PanierComponent } from './components/panier/panier';
import { CommandeComponent } from './components/commande/commande';
import { AuthComponent } from './components/auth/auth';
import { CheckoutComponent } from './components/checkout/checkout';
import { RegisterComponent } from './components/register/register';
import { FinaliserCommandeComponent } from './components/finaliser-commande/finaliser-commande';
import { MesCommandesComponent } from './components/mes-commandes/mes-commandes';

export const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'produits', component: ProduitComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'commandes', component: CommandeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'finaliser', component: FinaliserCommandeComponent },
  {path: 'mes-commandes',component: MesCommandesComponent},

  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];
