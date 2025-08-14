import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define the Client model
export interface Client {
    id_client: string;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    type_personne: string;
    vehiculeId?: string;
}

// Injectable service for handling Client operations
@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private clients: Client[] = this.getData(); // Initialize with mock data

    constructor() {}

    // Mock data function
    getData(): Client[] {
        return [
            { id_client: '1', nom: 'Smith', prenom: 'John', email: 'john.smith@example.com', tel: '123456789', type_personne: 'Individual' },
            { id_client: '2', nom: 'Doe', prenom: 'Jane', email: 'jane.doe@example.com', tel: '987654321', type_personne: 'Company' },
            { id_client: '3', nom: 'Martinez', prenom: 'Carlos', email: 'carlos.m@example.com', tel: '456789123', type_personne: 'Individual' },
            { id_client: '4', nom: 'Nguyen', prenom: 'Linh', email: 'linh.nguyen@example.com', tel: '789123456', type_personne: 'Company' },
            { id_client: '5', nom: 'Kim', prenom: 'Jisoo', email: 'jisoo.k@example.com', tel: '159357456', type_personne: 'Individual' },
            { id_client: '6', nom: 'Johnson', prenom: 'Emily', email: 'emily.j@example.com', tel: '753951258', type_personne: 'Company' },
            { id_client: '7', nom: 'Brown', prenom: 'Michael', email: 'michael.b@example.com', tel: '852963741', type_personne: 'Individual' },
            { id_client: '8', nom: 'Garcia', prenom: 'Sofia', email: 'sofia.g@example.com', tel: '951753852', type_personne: 'Company' },
            { id_client: '9', nom: 'Wilson', prenom: 'David', email: 'david.w@example.com', tel: '321654987', type_personne: 'Individual' },
            { id_client: '10', nom: 'Lopez', prenom: 'Maria', email: 'maria.l@example.com', tel: '741852963', type_personne: 'Company' },
            { id_client: '11', nom: 'Taylor', prenom: 'Chris', email: 'chris.t@example.com', tel: '654987321', type_personne: 'Individual' },
            { id_client: '12', nom: 'Harris', prenom: 'Laura', email: 'laura.h@example.com', tel: '258963147', type_personne: 'Company' },
            { id_client: '13', nom: 'Clark', prenom: 'Matthew', email: 'matthew.c@example.com', tel: '369852741', type_personne: 'Individual' },
            { id_client: '14', nom: 'Rodriguez', prenom: 'Olivia', email: 'olivia.r@example.com', tel: '741369852', type_personne: 'Company' },
            { id_client: '15', nom: 'Evans', prenom: 'Daniel', email: 'daniel.e@example.com', tel: '123789456', type_personne: 'Individual' },
            { id_client: '16', nom: 'Hill', prenom: 'Jessica', email: 'jessica.h@example.com', tel: '654123987', type_personne: 'Company' },
            { id_client: '17', nom: 'Walker', prenom: 'Anthony', email: 'anthony.w@example.com', tel: '789654123', type_personne: 'Individual' },
            { id_client: '18', nom: 'Perez', prenom: 'Sophia', email: 'sophia.p@example.com', tel: '852147963', type_personne: 'Company' },
            { id_client: '19', nom: 'Carter', prenom: 'Ethan', email: 'ethan.c@example.com', tel: '963258741', type_personne: 'Individual' },
            { id_client: '20', nom: 'White', prenom: 'Mia', email: 'mia.w@example.com', tel: '357951258', type_personne: 'Company' }
        ];
    }

    // Get all clients
    getClients(): Observable<Client[]> {
        return of(this.clients);
    }

    // Get a client by ID
    getClientById(id: string): Observable<Client | undefined> {
        const client = this.clients.find((c) => c.id_client === id);
        return of(client);
    }

    // Create a new client
    createClient(client: Client): Observable<Client> {
        this.clients.push(client);
        return of(client);
    }

    // Update an existing client
    updateClient(id: string, clientUpdates: Partial<Client>): Observable<Client | undefined> {
        const clientIndex = this.clients.findIndex((c) => c.id_client === id);
        if (clientIndex !== -1) {
            this.clients[clientIndex] = { ...this.clients[clientIndex], ...clientUpdates };
            return of(this.clients[clientIndex]);
        }
        return of(undefined);
    }

    // Delete a client
    deleteClient(id: string): Observable<boolean> {
        const initialLength = this.clients.length;
        this.clients = this.clients.filter((c) => c.id_client !== id);
        return of(this.clients.length < initialLength);
    }

    // client.service.ts (add this)
    getClientByVehiculeId(vehiculeId: string): Observable<Client | undefined> {
        const client = this.clients.find((c) => c.vehiculeId === vehiculeId);
        return of(client);
    }
}
