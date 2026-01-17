import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  categoryName: string = '';
  editId: number | null = null;
  selectedCategoryId: number | null = null;
  products: any[] = [];
  role = localStorage.getItem('role'); // ADMIN ou CLIENT

  categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.loadCategories();
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  addCategory() {
    if (!this.isAdmin()) return; // Sécurité côté client
    if (!this.categoryName.trim()) return;

    this.categoryService.addCategory({ nom: this.categoryName })
      .subscribe(() => {
        this.loadCategories();
        this.categoryName = '';
      });
  }

  editCategory(cat: any) {
    if (!this.isAdmin()) return;
    this.editId = cat.id;
    this.categoryName = cat.nom;
  }

  updateCategory() {
    if (!this.isAdmin() || this.editId === null) return;

    this.categoryService.updateCategory(this.editId, { nom: this.categoryName })
      .subscribe(() => {
        this.loadCategories();
        this.categoryName = '';
        this.editId = null;
      });
  }

  deleteCategory(id: number) {
    if (!this.isAdmin()) return;
    this.categoryService.deleteCategory(id)
      .subscribe(() => this.loadCategories());
  }

  selectCategory(cat: any) {
    this.selectedCategoryId = cat.id;
    this.categoryService.getProductsByCategory(cat.id).subscribe(res => {
      this.products = res;
    });
  }

}
