import { Routes } from '@angular/router';
import { ClientsComponent } from "./clients/clients.component";
import { ProfilClientComponent } from './clients/profil-client/profil-client.component';
import { ServicesComponent } from './services/services.component';
import { PiecesComponent } from './pieces/pieces.component';
import { VehiculesComponent } from './vehicules/vehicules.component';
import { ProfilVehiculeComponent } from './vehicules/profil-vehicule/profil-vehicule.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';


export default [
    { path: 'clients', data: { breadcrumb: 'Clients' }, component: ClientsComponent },
    { path: 'client-profile/:id', data: { breadcrumb: 'Profil' }, component: ProfilClientComponent },
    { path: 'vehicules', data: { breadcrumb: 'Vehicules' }, component: VehiculesComponent },
    { path: 'vehicule-profile/:id', data: { breadcrumb: 'Profil' }, component: ProfilVehiculeComponent },
    { path: 'pieces', data: { breadcrumb: 'Pieces' }, component: PiecesComponent },
    { path: 'services', data: { breadcrumb: 'Services' }, component: ServicesComponent },
    { path: 'fournisseurs', data: { breadcrumb: 'Fournisseurs' }, component: FournisseurComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;