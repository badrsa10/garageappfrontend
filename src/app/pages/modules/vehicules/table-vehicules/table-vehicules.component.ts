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
import { ConfirmationService, MessageService } from 'primeng/api';

import { Client, ClientService } from '../../../service/clients.service';
import { Vehicule, VehiculeService } from '../../../service/vehicules.service';
import { DropdownModule } from 'primeng/dropdown';
import { MarqueModel, MarqueModelService } from '../../../service/marque-model.service';
import { forkJoin } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'table-vehicules',
    standalone: true,
    templateUrl: './table-vehicules.component.html',
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }
        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [MessageService, ConfirmationService],
    imports: [CommonModule, FormsModule, RouterModule, TableModule, DialogModule, ButtonModule, ToastModule, InputTextModule, IconFieldModule, InputIconModule, DropdownModule, ConfirmDialogModule]
})
export class TableVehiculesComponent implements OnInit {
    vehicules: Vehicule[] = [];
    selectedVehicules: Vehicule[] = [];
    loading = false;

    pageSize = 10;
    currentPage = 1;
    totalVehicules = 0;
    globalFilter = '';

    displayDialog = false;
    newVehicule: Partial<Vehicule> = {};
    clients: { id_client: string; fullName: string }[] = [];

    marqueModels: MarqueModel[] = [];
    marques: string[] = [];
    modeles: string[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private vehiculeService: VehiculeService,
        private messageService: MessageService,
        private clientService: ClientService,
        private marqueModelService: MarqueModelService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.fetchVehicules();
        this.fetchClients();
        this.marqueModelService.getAllMarques().subscribe((marques) => {
            this.marques = marques;
        });
        this.fetchMarqueModels();
    }

    fetchClients() {
        this.clientService.getClients(1, 100).subscribe({
            next: (response) => {
                this.clients = response.data.map((c) => ({
                    id_client: c.id_client,
                    fullName: `${c.nom} ${c.prenom}`
                }));
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
            }
        });
    }

    fetchVehicules(page: number = this.currentPage) {
        this.loading = true;
        this.vehiculeService.getVehicules(page, this.pageSize, this.globalFilter).subscribe({
            next: (res) => {
                this.vehicules = res.data;
                this.totalVehicules = res.meta.totalVehicules;
                this.currentPage = res.meta.currentPage;
                this.pageSize = res.meta.pageSize;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch vehicules' });
            }
        });
    }

    fetchMarqueModels() {
        this.marqueModelService.getAll().subscribe({
            next: (data) => {
                this.marqueModels = data;
                this.marques = [...new Set(data.map((m) => m.marque))];
            },
            error: (err) => {
                console.error('Error fetching marque models:', err);
            }
        });
    }

    onMarqueChange(selectedMarque: string) {
        this.marqueModelService.getModelsByMarque(selectedMarque).subscribe((models) => {
            this.modeles = models;
            this.newVehicule.modele = '';
        });
    }

    onPageChange(event: any) {
        this.pageSize = event.rows;
        const page = event.first / event.rows + 1;
        this.fetchVehicules(page);
    }

    onGlobalFilter(table: Table, event: Event) {
        const input = event.target as HTMLInputElement;
        this.globalFilter = input.value;
        this.fetchVehicules(1);
    }

    clear(table: Table) {
        table.clear();
        this.globalFilter = '';
        if (this.filter) this.filter.nativeElement.value = '';
        this.fetchVehicules(1);
    }

    openAddDialog() {
        this.newVehicule = {};
        this.displayDialog = true;
    }

    addVehicule() {
        const { marque, modele, annee, kilometrage, matricule, numeroSerie, clientId } = this.newVehicule;
        if (!marque || !modele || !annee || !kilometrage || !matricule || !numeroSerie || !clientId) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'All fields are required' });
            return;
        }

        this.vehiculeService.createVehicule({ marque, modele, annee, kilometrage, matricule, numeroSerie, clientId }).subscribe({
            next: (created) => {
                this.messageService.add({ severity: 'success', summary: 'Created', detail: `Vehicule "${created.matricule}" added` });
                console.log('Creating vehicule with:', this.newVehicule);
                this.displayDialog = false;
                this.fetchVehicules(1);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create vehicule' });
            }
        });
    }

    updateVehicule(vehicule: Partial<Vehicule>) {
        if (!vehicule.id_vehicule) return;

        this.vehiculeService.updateVehicule(vehicule.id_vehicule, vehicule).subscribe({
            next: (updated) => {
                const index = this.vehicules.findIndex((v) => v.id_vehicule === vehicule.id_vehicule);
                if (index !== -1) {
                    this.vehicules[index] = { ...this.vehicules[index], ...updated };
                }
                this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Vehicule updated' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update vehicule' });
            }
        });
    }

    deleteVehicule(id: string) {
        this.vehiculeService.deleteVehicule(id).subscribe({
            next: (success) => {
                if (success) {
                    this.vehicules = this.vehicules.filter((v) => v.id_vehicule !== id);
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Vehicule deleted' });
                }
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vehicule' });
            }
        });
    }

    deleteSelectedVehicules(): void {
        if (!this.selectedVehicules.length) return;

        const ids = this.selectedVehicules.map((v) => v.id_vehicule);
        const deleteRequests = ids.map((id) => this.vehiculeService.deleteVehicule(id));

        forkJoin(deleteRequests).subscribe({
            next: (results) => {
                const failed = results.filter((r) => !r).length;

                if (failed === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'All selected vehicules have been deleted'
                    });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Partial Delete',
                        detail: `${failed} vehicule(s) failed to delete`
                    });
                }

                this.fetchVehicules(this.currentPage);
                this.selectedVehicules = [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Bulk deletion failed'
                });
            }
        });
    }

    confirmBulkDeleteVehicules(): void {
        if (!this.selectedVehicules.length) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${this.selectedVehicules.length} selected vehicule(s)?`,
            header: 'Confirm Bulk Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteSelectedVehicules()
        });
    }

    navigateToVehicule(id: string) {
        this.router.navigateByUrl(`/modules/vehicule-profile/${id}`);
        console.log('selected vehicule ', id);
    }
}
