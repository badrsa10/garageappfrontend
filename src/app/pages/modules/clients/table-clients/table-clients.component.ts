import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Client, ClientService } from '../../../service/clients.service';
import { Observable } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';
import { ProfilClientComponent } from '../profil-client/profil-client.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';




@Component({
    selector: 'table-clients',
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        DialogModule,
        RouterModule
    ],
    standalone: true,
    templateUrl: './table-clients.component.html',
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }
        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }`,
    providers: [ConfirmationService, MessageService, ClientService]
})
export class TableClientsComponent implements OnInit {
    clients: Client[] = [];
    selectedClients: Client[] = [];
    loading: boolean = true;
    displayDialog: boolean = false;

    // ✅ Define newClient with default values
    newClient: Client = {
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        type_personne: '',
        id_client: ''
    };

    @ViewChild('filter') filter!: ElementRef;

    constructor(private clientService: ClientService, 
        private messageService: MessageService, 
        private router: Router) { }

    ngOnInit() {
        this.fetchClients();
    }

    navigateToProfile(clientId: string) {
        if (this.router) {
            console.log('Router instance OK');
            console.log('Client ID:', clientId); 
            this.router.navigateByUrl(`/modules/client-profile/${clientId}`);

        } else {
            console.log('Router instance not OK');
            console.error('Router instance is undefined.');
        }
    }

    fetchClients() {
        this.clientService.getClients().subscribe({
            next: (clients) => {
                this.clients = clients;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch clients' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    addClient(client: Client) {
        this.clientService.createClient(client).subscribe({
            next: (newClient) => {
                this.clients.push(newClient);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client added' });
            },
            error: (err) => {
                console.error('Error adding client:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add client' });
            }
        });
    }

    updateClient(client: Partial<Client>) {
        if (!client.id_client) return;
        this.clientService.updateClient(client.id_client, client).subscribe({
            next: (updatedClient) => {
                const index = this.clients.findIndex(c => c.id_client === client.id_client);
                if (index !== -1) {
                    this.clients[index] = { ...this.clients[index], ...updatedClient };
                }
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client updated' });
            },
            error: (err) => {
                console.error('Error updating client:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update client' });
            }
        });
    }

    deleteClient(clientId: string) {
        this.clientService.deleteClient(clientId).subscribe({
            next: () => {
                this.clients = this.clients.filter(c => c.id_client !== clientId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client deleted' });
            },
            error: (err) => {
                console.error('Error deleting client:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete client' });
            }
        });
    }
}


