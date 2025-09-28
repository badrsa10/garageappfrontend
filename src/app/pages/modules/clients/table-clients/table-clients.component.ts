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

import { Client, ClientService } from '../../../service/clients.service';

@Component({
    selector: 'table-clients',
    standalone: true,
    templateUrl: './table-clients.component.html',
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }
        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [MessageService],
    imports: [CommonModule, FormsModule, RouterModule, TableModule, DialogModule, ButtonModule, ToastModule, InputTextModule, IconFieldModule, InputIconModule]
})
export class TableClientsComponent implements OnInit {
    clients: Client[] = [];
    selectedClients: Client[] = [];
    loading = false;

    pageSize = 10;
    currentPage = 1;
    totalClients = 0;
    globalFilter = '';

    displayDialog = false;
    newClient: Partial<Client> = {};

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private clientService: ClientService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.fetchClients();
    }

    fetchClients(page: number = this.currentPage) {
        this.loading = true;
        this.clientService.getClients(page, this.pageSize, this.globalFilter).subscribe({
            next: (res) => {
                this.clients = res.data;
                this.totalClients = res.meta.totalClients;
                this.currentPage = res.meta.currentPage;
                this.pageSize = res.meta.pageSize;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch clients' });
            }
        });
    }

    onPageChange(event: any) {
        this.pageSize = event.rows;
        const page = event.first / event.rows + 1;
        this.fetchClients(page);
    }

    onGlobalFilter(table: Table, event: Event) {
        const input = event.target as HTMLInputElement;
        this.globalFilter = input.value;
        this.fetchClients(1);
    }

    clear(table: Table) {
        table.clear();
        this.globalFilter = '';
        if (this.filter) this.filter.nativeElement.value = '';
        this.fetchClients(1);
    }

    openAddDialog() {
        this.newClient = {};
        this.displayDialog = true;
    }

    addClient() {
        const { nom, prenom, email, tel, type_personne } = this.newClient;
        if (!nom || !prenom || !email || !tel || !type_personne) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'All fields are required' });
            return;
        }

        this.clientService.createClient({ nom, prenom, email, tel, type_personne }).subscribe({
            next: (created) => {
                this.messageService.add({ severity: 'success', summary: 'Created', detail: `Client "${created.nom}" added` });
                this.displayDialog = false;
                this.fetchClients(1);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create client' });
            }
        });
    }

    updateClient(client: Partial<Client>) {
        if (!client.id_client) return;

        this.clientService.updateClient(client.id_client, client).subscribe({
            next: (updated) => {
                const index = this.clients.findIndex((c) => c.id_client === client.id_client);
                if (index !== -1) {
                    this.clients[index] = { ...this.clients[index], ...updated };
                }
                this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Client updated' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update client' });
            }
        });
    }

    deleteClient(id: string) {
        this.clientService.deleteClient(id).subscribe({
            next: (success) => {
                if (success) {
                    this.clients = this.clients.filter((c) => c.id_client !== id);
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Client deleted' });
                }
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete client' });
            }
        });
    }

    deleteSelectedClients() {
        if (!this.selectedClients.length) return;

        const ids = this.selectedClients.map((c) => c.id_client);
        let deletedCount = 0;

        ids.forEach((id) => {
            this.clientService.deleteClient(id).subscribe({
                next: (success) => {
                    if (success) {
                        deletedCount++;
                        if (deletedCount === ids.length) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Deleted',
                                detail: 'Selected clients have been deleted'
                            });
                            this.fetchClients(this.currentPage);
                        }
                    }
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete some clients'
                    });
                }
            });
        });

        this.selectedClients = [];
    }

    navigateToProfile(clientId: string) {
        this.router.navigateByUrl(`/modules/client-profile/${clientId}`);
    }

   

}
