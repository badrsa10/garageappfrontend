import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientService } from '../../../service/clients.service';
import { Client } from '../../../service/clients.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicule, VehiculeService } from '../../../service/vehicules.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'client-profil',
  templateUrl: './profil-client.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, DialogModule, FormsModule],
})
export class ProfilClientComponent implements OnInit {
  client: Client | undefined;
    editDialog: boolean = false;

    editedClient: Client = {
      nom: '', prenom: '', email: '', tel: '', type_personne: '',
      id_client: ''
    };

  constructor(private route: ActivatedRoute,
    private clientService: ClientService,
    private vehiculeService: VehiculeService,
    private router: Router) { }

  vehicules: Vehicule[] = [];

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.clientService.getClientById(clientId).subscribe(client => {
        this.client = client;
      });
      this.vehiculeService.getVehiculesByClientId(clientId).subscribe(vehicules => {
        this.vehicules = vehicules;
      });
    }
  }
  goBack() {
    this.router.navigate(['/modules/clients']); // Navigates back to the main page
  }

  openEditDialog() {
        if (this.client) {
            this.editedClient = { ...this.client }; // ✅ Pre-fill the edit form
            this.editDialog = true; // ✅ Open the dialog
        }
    }

    saveClientChanges() {
        if (this.editedClient) {
            this.clientService.updateClient(this.editedClient.id_client,this.editedClient).subscribe(() => {
                this.client = { ...this.editedClient }; // ✅ Update UI dynamically
                this.editDialog = false; // ✅ Close dialog after saving changes
            });
        }
    }
}
