import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { switchMap, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Vehicule, VehiculeService } from '../../../service/vehicules.service';
import { VehiculeHistorique, VehiculeHistoriqueService } from '../../../service/vehiculehistorique.service';
import { Client, ClientService } from '../../../service/clients.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { Footer, MessageService } from 'primeng/api';
import { ServiceService } from '../../../service/services.service';
import { PieceService } from '../../../service/pieces.service';

interface NewHistoriquePayload {
    date_historique: string;
    kilometrage: number | null;
    pieceId?: string;
    serviceId?: string;
    remarque: string;
}

@Component({
    selector: 'vehicule-profil',
    templateUrl: './profil-vehicule.component.html',
    standalone: true,
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
        InputIconModule,
        DropdownModule,
        RippleModule,
        RatingModule,
        ToggleButtonModule,
        ProgressBarModule,
        SliderModule,
        TagModule,
        SelectModule,
        MultiSelectModule
    ],
    providers: [MessageService]
})
export class ProfilVehiculeComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    vehicule: Vehicule | null = null;
    client: Client | null = null;
    historiques: VehiculeHistorique[] = [];

    editDialog = false;
    editedVehicule: Vehicule = {
        id_vehicule: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        kilometrage: 0,
        matricule: '',
        numeroSerie: '',
        clientId: ''
    };

    historiqueTypes = [
        { label: 'Pièce', value: 'piece' },
        { label: 'Service', value: 'service' }
    ];

    newHistorique: NewHistoriquePayload = {
        date_historique: '',
        kilometrage: null,
        pieceId: undefined,
        serviceId: undefined,
        remarque: ''
    };

    selectedType: 'piece' | 'service' | null = null;
    addHistoriqueDialog = false;

    pieces: any[] = [];
    services: any[] = [];
    vehiculeId: string | null = '';

    selectedHistoriques: VehiculeHistorique[] = [];

    constructor(
        private route: ActivatedRoute,
        private vehiculeService: VehiculeService,
        private historiqueService: VehiculeHistoriqueService,
        private serviceService: ServiceService,
        private pieceService: PieceService,
        private messageService: MessageService,
        private clientService: ClientService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.vehiculeId = this.route.snapshot.paramMap.get('id');
        if (!this.vehiculeId) return;

        this.vehiculeService
            .getVehiculeById(this.vehiculeId)
            .pipe(
                tap((v) => (this.vehicule = v)),
                switchMap((v) => (v?.clientId ? this.clientService.getClientById(v.clientId) : of(null)))
            )
            .subscribe((client) => {
                this.client = client;
            });

        this.historiqueService.getVehiculeHistoriquesByVehiculeId(this.vehiculeId).subscribe((data) => {
            this.historiques = data;
        });
        // 🔹 Fetch pieces and services for historique dropdowns
        this.pieceService.getPieces(1, 100).subscribe((res) => {
            this.pieces = res.data;
        });

        this.serviceService.getServices(1, 100).subscribe((res) => {
            this.services = res.data;
        });
    }

    goBack(): void {
        this.router.navigate(['/modules/vehicules']);
    }

    openEditDialog(): void {
        if (this.vehicule) {
            this.editedVehicule = { ...this.vehicule };
            this.editDialog = true;
        }
    }

    saveVehiculeChanges(): void {
        if (!this.editedVehicule) return;

        this.vehiculeService.updateVehicule(this.editedVehicule.id_vehicule, this.editedVehicule).subscribe(() => {
            this.vehicule = { ...this.editedVehicule };
            this.editDialog = false;
        });
    }

    deleteVehicule(): void {
        if (!this.vehicule) return;

        this.vehiculeService.deleteVehicule(this.vehicule.id_vehicule).subscribe(() => {
            this.router.navigate(['/modules/vehicules']);
        });
    }

    onGlobalFilter(table: Table, event: Event): void {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    clear(table: Table): void {
        table.clear();
        if (this.filter) this.filter.nativeElement.value = '';
    }

    openAddHistoriqueDialog(): void {
        this.newHistorique = {
            date_historique: '',
            kilometrage: this.vehicule?.kilometrage ?? null,
            pieceId: undefined,
            serviceId: undefined,
            remarque: ''
        };
        this.selectedType = null;
        this.addHistoriqueDialog = true;

        this.messageService.add({
            severity: 'info',
            summary: 'Ajout Historique',
            detail: 'Ouverture du formulaire...'
        });
    }

    submitHistorique(): void {
        const { date_historique, kilometrage, pieceId, serviceId, remarque } = this.newHistorique;

        // 🔒 Validation
        if (!this.vehiculeId || !date_historique || kilometrage === null || (!pieceId && !serviceId)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Champs manquants',
                detail: 'Veuillez remplir tous les champs obligatoires.'
            });
            return;
        }

        if (pieceId && serviceId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Conflit',
                detail: 'Veuillez choisir soit une pièce, soit un service — pas les deux.'
            });
            return;
        }

        // 📦 Construct payload
        const payload: Omit<VehiculeHistorique, 'id_vehicule_historique'> = {
            vehiculeId: this.vehiculeId,
            date_historique: new Date(date_historique),
            kilometrage: typeof kilometrage === 'string' ? parseInt(kilometrage, 10) : kilometrage,
            pieceId: pieceId ?? null,
            serviceId: serviceId ?? null,
            remarque: remarque?.trim() || undefined
        };
        console.log('📦 Payload envoyé:', payload);

        // 🚀 Submit to backend
        this.historiqueService.createHistorique(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Historique ajouté',
                    detail: "L'historique a été enregistré avec succès."
                });
                this.addHistoriqueDialog = false;

                // 🔄 Refresh list
                if (!this.vehiculeId) return;
                this.historiqueService.getVehiculeHistoriquesByVehiculeId(this.vehiculeId).subscribe((data) => {
                    this.historiques = data;
                });
            },
            error: (err) => {
                console.error('❌ Historique API error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err?.error?.error || "Impossible d'enregistrer l'historique."
                });
            }
        });
    }
    bulkDelete(): void {
        if (!this.selectedHistoriques?.length) return;

        const ids = this.selectedHistoriques.map((h) => h.id_vehicule_historique);

        Promise.all(ids.map((id) => this.historiqueService.deleteHistorique(id).toPromise()))
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Suppression réussie',
                    detail: `${ids.length} historiques supprimés.`
                });
                this.selectedHistoriques = [];
                // 🔄 Refresh list
                if (!this.vehiculeId) return;
                this.historiqueService.getVehiculeHistoriquesByVehiculeId(this.vehiculeId).subscribe((data) => {
                    this.historiques = data;
                });
            })
            .catch((err) => {
                console.error('❌ Bulk delete error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Échec de la suppression des historiques.'
                });
            });
    }
}
