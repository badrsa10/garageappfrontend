import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { Service, ServiceService } from '../../service/services.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'services',
    standalone: true,
    providers: [MessageService],
    imports: [CommonModule, FormsModule, RouterModule, TableModule, ToastModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, DialogModule],
    templateUrl: './services.component.html'
})
export class ServicesComponent {
    services: Service[] = [];
    selectedServices: Service[] = [];
    editingService: Service | null = null;
    serviceDialog = false;

    loading = false;
    pageSize = 10;
    currentPage = 1;
    totalServices = 0;
    globalFilter = '';

    newService: Partial<Service> = { libelle: '' };

    constructor(
        private serviceService: ServiceService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.fetchServices();
    }

    fetchServices(page: number = this.currentPage) {
        this.loading = true;
        this.serviceService.getServices(page, this.pageSize, this.globalFilter).subscribe({
            next: (res) => {
                this.services = res.data;
                this.totalServices = res.meta.totalServices; // ✅ now matches interface
                this.currentPage = res.meta.currentPage;
                this.pageSize = res.meta.pageSize;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch services' });
            }
        });
    }

    onPageChange(event: any) {
        this.pageSize = event.rows;
        const page = event.first / event.rows + 1;
        this.fetchServices(page);
    }

    onGlobalFilter(event: Event) {
        const input = event.target as HTMLInputElement;
        this.globalFilter = input.value;
        this.fetchServices(1);
    }

    clear(table: Table) {
        table.clear();
        this.globalFilter = '';
        this.fetchServices(1);
    }

    startEdit(service: Service) {
        this.editingService = { ...service };
    }

    saveEdit() {
        if (!this.editingService) return;

        const { id_service, libelle } = this.editingService;
        const original = this.services.find((s) => s.id_service === id_service);

        if (original && original.libelle !== libelle.trim()) {
            this.serviceService.updateService(id_service, { libelle: libelle.trim() }).subscribe({
                next: (updated) => {
                    Object.assign(original, updated);
                    this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Service updated to "${updated.libelle}"` });
                },
                error: (err) => {
                    if (err.status === 409) {
                        this.messageService.add({ severity: 'warn', summary: 'Duplicate', detail: 'A service with this name already exists' });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update service' });
                    }
                }
            });
        }
        this.editingService = null;
    }

    openServiceDialog() {
        this.newService = { libelle: '' };
        this.serviceDialog = true;
    }

    addService() {
        if (!this.newService.libelle?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Service name is required' });
            return;
        }

        this.serviceService.createService({ libelle: this.newService.libelle.trim() }).subscribe({
            next: (created) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: `Service "${created.libelle}" added`
                });
                this.serviceDialog = false;
                this.fetchServices(1);
            },
            error: (err) => {
                if (err.status === 409) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Duplicate',
                        detail: 'A service with this name already exists'
                    });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create service' });
                }
            }
        });
    }

    deleteSelected() {
        if (!this.selectedServices.length) return;

        const ids = this.selectedServices.map((s) => s.id_service);
        let deletedCount = 0;

        ids.forEach((id) => {
            this.serviceService.deleteService(id).subscribe({
                next: () => {
                    deletedCount++;
                    if (deletedCount === ids.length) {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Selected services deleted' });
                        this.fetchServices(this.currentPage);
                    }
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete some services' });
                }
            });
        });

        this.selectedServices = [];
    }
}
