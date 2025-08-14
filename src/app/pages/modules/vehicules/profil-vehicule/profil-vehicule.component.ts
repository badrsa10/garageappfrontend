import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { switchMap, filter, map, of, tap } from 'rxjs';

import { Vehicule, VehiculeService } from '../../../service/vehicules.service';
import { VehiculeHistorique, VehiculeHistoriqueService } from '../../../service/vehiculehistorique.service';
import { Client, ClientService } from '../../../service/clients.service';

@Component({
    selector: 'vehicule-profil',
    templateUrl: './profil-vehicule.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, DialogModule, FormsModule]
})
export class ProfilVehiculeComponent implements OnInit {
    editDialog: boolean = false;
    vehicule: Vehicule | null = null;
    client: Client | null = null;

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

    historiques: VehiculeHistorique[] = []; // fetched history

    constructor(
        private route: ActivatedRoute,
        private vehiculeService: VehiculeService,
        private historiqueService: VehiculeHistoriqueService,
        private clientService: ClientService,
        private router: Router
    ) {}

    ngOnInit() {
        const vehiculeId = this.route.snapshot.paramMap.get('id');
        if (vehiculeId) {
            // 1) Load vehicule
            this.vehiculeService.getVehiculeById(vehiculeId).subscribe((v) => {
                if (!v) return;
                this.vehicule = v;

                // 2) Load client only if clientId is present
                if (v.clientId) {
                    this.clientService.getClientById(v.clientId).subscribe((c) => {
                        this.client = c ?? null;
                    });
                } else {
                    this.client = null;
                }
            });

            // ✅ Get vehicle history records
            this.historiqueService.getVehiculeHistoriquesByVehiculeId(vehiculeId).subscribe((data) => {
                // Normalize to always be an array
                this.historiques = Array.isArray(data) ? data : data ? [data] : [];

                console.log('Historiques loaded:', this.historiques);
            });
        }
    }

    goBack() {
        this.router.navigate(['/modules/vehicules']);
    }

    openEditDialog() {
        if (this.vehicule) {
            this.editedVehicule = { ...this.vehicule };
            this.editDialog = true;
        }
    }

    saveVehiculeChanges() {
        if (this.editedVehicule) {
            this.vehiculeService.updateVehicule(this.editedVehicule.id_vehicule, this.editedVehicule).subscribe(() => {
                this.vehicule = { ...this.editedVehicule };
                this.editDialog = false;
            });
        }
    }

    deleteVehicule() {
        if (this.vehicule) {
            this.vehiculeService.deleteVehicule(this.vehicule.id_vehicule).subscribe(() => {
                this.router.navigate(['/modules/vehicules']);
            });
        }
    }
}
