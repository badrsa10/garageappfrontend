import { Routes } from '@angular/router';
import { ClientsComponent } from "./clients/clients.component";
import { ProfilClientComponent } from './clients/profil-client/profil-client.component';
import { ServicesComponent } from './services/services.component';
import { PiecesComponent } from './pieces/pieces.component';


export default [
    { path: 'clients', data: { breadcrumb: 'Clients' }, component: ClientsComponent },
    { path: 'client-profile/:id', data: { breadcrumb: 'Profil' }, component: ProfilClientComponent },
    { path: 'pieces', data: { breadcrumb: 'Pieces' }, component: PiecesComponent },
    { path: 'services', data: { breadcrumb: 'Services' }, component: ServicesComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;