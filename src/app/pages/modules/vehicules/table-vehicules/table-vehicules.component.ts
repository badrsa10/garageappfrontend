import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
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
import { DialogModule } from 'primeng/dialog';
import { RouterModule, Router } from '@angular/router';

import { Vehicule, VehiculeService } from '../../../service/vehicules.service';
import { Client, ClientService } from '../../../service/clients.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'table-vehicules',
    standalone: true,
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
        DropdownModule,
        RouterModule
    ],
    templateUrl: './table-vehicules.component.html',
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }
        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [ConfirmationService, MessageService, VehiculeService, ClientService]
})
export class TableVehiculesComponent implements OnInit {
    vehicules: Vehicule[] = [];
    selectedVehicules: Vehicule[] = [];
    loading: boolean = true;
    displayDialog: boolean = false;

    clients: { id_client: string, fullName: string }[] = [];

    // ✅ Define newVehicule with default values
    newVehicule: Vehicule = {
        id_vehicule: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        kilometrage: 0,
        matricule: '',
        numeroSerie: '',
        clientId: undefined
    };

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private vehiculeService: VehiculeService,
        private clientService: ClientService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.fetchVehicules();
        this.fetchClients();
    }

    navigateToVehicule(vehiculeId: string) {
        if (this.router) {
            this.router.navigateByUrl(`/modules/vehicule-profile/${vehiculeId}`);
        } else {
            console.error('Router instance is undefined.');
        }
    }

    fetchVehicules() {
        this.vehiculeService.getVehicules().subscribe({
            next: (vehicules) => {
                this.vehicules = vehicules;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching vehicules:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch vehicules' });
            }
        });
    }

    fetchClients() {
        this.clientService.getClients().subscribe({
            next: (clients) => {
                this.clients = clients.map(c => ({
                    id_client: c.id_client,
                    fullName: `${c.nom} ${c.prenom}`
                }));
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
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

    addVehicule(vehicule: Vehicule) {
        if (!vehicule.id_vehicule) {
            vehicule.id_vehicule = 'V' + (this.vehicules.length + 1).toString().padStart(3, '0');
        }

        this.vehiculeService.addVehicule(vehicule).subscribe({
            next: (newVehicule) => {
                this.vehicules.push(newVehicule);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicule added' });
                this.displayDialog = false;
                this.newVehicule = {
                    id_vehicule: '',
                    marque: '',
                    modele: '',
                    annee: new Date().getFullYear(),
                    kilometrage: 0,
                    matricule: '',
                    numeroSerie: '',
                    clientId: undefined
                };
            },
            error: (err) => {
                console.error('Error adding vehicule:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add vehicule' });
            }
        });
    }

    updateVehicule(vehicule: Partial<Vehicule>) {
        if (!vehicule.id_vehicule) return;
        this.vehiculeService.updateVehicule(vehicule.id_vehicule, vehicule).subscribe({
            next: (updatedVehicule) => {
                const index = this.vehicules.findIndex(v => v.id_vehicule === vehicule.id_vehicule);
                if (index !== -1 && updatedVehicule) {
                    this.vehicules[index] = { ...this.vehicules[index], ...updatedVehicule };
                }
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicule updated' });
            },
            error: (err) => {
                console.error('Error updating vehicule:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update vehicule' });
            }
        });
    }

    deleteVehicule(vehiculeId: string) {
        this.vehiculeService.deleteVehicule(vehiculeId).subscribe({
            next: () => {
                this.vehicules = this.vehicules.filter(v => v.id_vehicule !== vehiculeId);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehicule deleted' });
            },
            error: (err) => {
                console.error('Error deleting vehicule:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vehicule' });
            }
        });
    }
}
