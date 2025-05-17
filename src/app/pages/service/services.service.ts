import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define the Service model
export interface Service {
  id_service: string;
  libelle: string; // Modify as needed
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private services: Service[] = this.getData(); // Initialize with mock data

  constructor() {}

  // Mock data function
  getData(): Service[] {
    return [
      { id_service: '1', libelle: 'Maintenance'  },
      { id_service: '2', libelle: 'Repair'  },
      { id_service: '3', libelle: 'Oil Change'  },
      { id_service: '4', libelle: 'Inspection'  },
      { id_service: '5', libelle: 'Diagnostics'  },
      { id_service: '6', libelle: 'Tire Replacement'  },
      { id_service: '7', libelle: 'Battery Check'  },
      { id_service: '8', libelle: 'Brake Service'  },
      { id_service: '9', libelle: 'Alignment'  },
      { id_service: '10', libelle: 'Cleaning'  },
      { id_service: '11', libelle: 'Engine Repair'  },
      { id_service: '12', libelle: 'Transmission Service'  },
    ];
  }

  // Get all services
  getServices(): Observable<Service[]> {
    return of(this.services);
  }

  // Get a service by ID
  getServiceById(id: string): Observable<Service | undefined> {
    const service = this.services.find(s => s.id_service === id);
    return of(service);
  }

  // Create a new service
  createService(service: Service): Observable<Service> {
    this.services.push(service);
    return of(service);
  }

  // Update an existing service
  updateService(id: string, serviceUpdates: Partial<Service>): Observable<Service | undefined> {
    const serviceIndex = this.services.findIndex(s => s.id_service === id);
    if (serviceIndex !== -1) {
      this.services[serviceIndex] = { ...this.services[serviceIndex], ...serviceUpdates };
      return of(this.services[serviceIndex]);
    }
    return of(undefined);
  }

  // Delete a service
  deleteService(id: string): Observable<boolean> {
    const initialLength = this.services.length;
    this.services = this.services.filter(s => s.id_service !== id);
    return of(this.services.length < initialLength);
  }
}
