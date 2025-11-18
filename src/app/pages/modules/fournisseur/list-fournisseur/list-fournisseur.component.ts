import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

import { Fournisseur, FournisseurService } from '../../../service/fournisseur.service';

@Component({
  selector: 'list-fournisseur',
  standalone: true,
  templateUrl: './list-fournisseur.component.html',
  styles: `
    .p-datatable-frozen-tbody {
      font-weight: bold;
    }
    .p-datatable-scrollable .p-frozen-column {
      font-weight: bold;
    }
  `,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class ListFournisseurComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  selectedFournisseurs: Fournisseur[] = [];
  loading = false;

  pageSize = 10;
  currentPage = 1;
  totalFournisseurs = 0;
  globalFilter = '';

  displayDialog = false;
  newFournisseur: Partial<Fournisseur> = {};

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fournisseurService: FournisseurService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchFournisseurs();
  }

  fetchFournisseurs(page: number = this.currentPage) {
    this.loading = true;
    this.fournisseurService.getFournisseurs(page, this.pageSize, this.globalFilter).subscribe({
      next: (res) => {
        this.fournisseurs = res.data;
        this.totalFournisseurs = res.meta.totalFournisseurs;
        this.currentPage = res.meta.currentPage;
        this.pageSize = res.meta.pageSize;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch fournisseurs' });
      }
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.rows;
    const page = event.first / event.rows + 1;
    this.fetchFournisseurs(page);
  }

  onGlobalFilter(table: Table, event: Event) {
    const input = event.target as HTMLInputElement;
    this.globalFilter = input.value;
    this.fetchFournisseurs(1);
  }

  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
    if (this.filter) this.filter.nativeElement.value = '';
    this.fetchFournisseurs(1);
  }

  openAddDialog() {
    this.newFournisseur = {};
    this.displayDialog = true;
  }

  addFournisseur() {
    const { nom, prenom, email, tel } = this.newFournisseur;
    if (!nom || !prenom || !email || !tel) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'All fields are required' });
      return;
    }

    this.fournisseurService.createFournisseur({ nom, prenom, email, tel }).subscribe({
      next: (created) => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: `Fournisseur "${created.nom}" added` });
        this.displayDialog = false;
        this.fetchFournisseurs(1);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create fournisseur' });
      }
    });
  }

  updateFournisseur(fournisseur: Partial<Fournisseur>) {
    if (!fournisseur.id_fournisseur) return;

    this.fournisseurService.updateFournisseur(fournisseur.id_fournisseur, fournisseur).subscribe({
      next: (updated) => {
        const index = this.fournisseurs.findIndex((f) => f.id_fournisseur === fournisseur.id_fournisseur);
        if (index !== -1) {
          this.fournisseurs[index] = { ...this.fournisseurs[index], ...updated };
        }
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Fournisseur updated' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update fournisseur' });
      }
    });
  }

  deleteFournisseur(id: string) {
    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: (success) => {
        if (success) {
          this.fournisseurs = this.fournisseurs.filter((f) => f.id_fournisseur !== id);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Fournisseur deleted' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete fournisseur' });
      }
    });
  }

  deleteSelectedFournisseurs() {
    if (!this.selectedFournisseurs.length) return;

    const ids = this.selectedFournisseurs.map((f) => f.id_fournisseur);
    let deletedCount = 0;

    ids.forEach((id) => {
      this.fournisseurService.deleteFournisseur(id).subscribe({
        next: (success) => {
          if (success) {
            deletedCount++;
            if (deletedCount === ids.length) {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Selected fournisseurs have been deleted'
              });
              this.fetchFournisseurs(this.currentPage);
            }
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete some fournisseurs'
          });
        }
      });
    });
    this.selectedFournisseurs = [];
  }

  navigateToProfile(fournisseurId: string) {
    this.router.navigateByUrl(`/modules/fournisseur-profile/${fournisseurId}`);
  }
}
