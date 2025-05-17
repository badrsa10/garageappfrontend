import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Vehicule {
  id_vehicule: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  matricule: string;
  numeroSerie?: string;
  clientId?: string; // ID du client associé (optionnel)
}

@Injectable({
  providedIn: 'root',
})
export class VehiculeService {
  private vehicules: Vehicule[] = this.getData(); // Initialisation avec données mockées

  constructor() { }

  // 🔹 Données mockées
  getData(): Vehicule[] {
    return [
      { id_vehicule: 'V001', marque: 'Toyota', modele: 'Corolla', annee: 2015, kilometrage: 60000, matricule: 'XYZ123', numeroSerie: 'SER001', clientId: '1' },
      { id_vehicule: 'V002', marque: 'Ford', modele: 'Focus', annee: 2018, kilometrage: 45000, matricule: 'ABC456', numeroSerie: 'SER002', clientId: '1' },
      { id_vehicule: 'V003', marque: 'BMW', modele: 'X5', annee: 2020, kilometrage: 30000, matricule: 'DEF789', numeroSerie: 'SER003', clientId: '1' },
      { id_vehicule: 'V004', marque: 'Audi', modele: 'A4', annee: 2019, kilometrage: 35000, matricule: 'GHI012', numeroSerie: 'SER004', clientId: '2' },
      { id_vehicule: 'V005', marque: 'Mercedes', modele: 'C-Class', annee: 2021, kilometrage: 15000, matricule: 'JKL345', numeroSerie: 'SER005', clientId: '2' },
      { id_vehicule: 'V006', marque: 'Honda', modele: 'Civic', annee: 2017, kilometrage: 50000, matricule: 'MNO678', numeroSerie: 'SER006', clientId: '3' },
      { id_vehicule: 'V007', marque: 'Volkswagen', modele: 'Golf', annee: 2016, kilometrage: 55000, matricule: 'PQR789', numeroSerie: 'SER007', clientId: '4' },
      { id_vehicule: 'V008', marque: 'Chevrolet', modele: 'Malibu', annee: 2022, kilometrage: 12000, matricule: 'STU234', numeroSerie: 'SER008', clientId: '4' },
      { id_vehicule: 'V009', marque: 'Hyundai', modele: 'Elantra', annee: 2018, kilometrage: 40000, matricule: 'VWX567', numeroSerie: 'SER009', clientId: '5' },
      { id_vehicule: 'V010', marque: 'Nissan', modele: 'Altima', annee: 2020, kilometrage: 29000, matricule: 'YZA890', numeroSerie: 'SER010', clientId: '6' },
      { id_vehicule: 'V011', marque: 'Subaru', modele: 'Impreza', annee: 2019, kilometrage: 38000, matricule: 'BCD135', numeroSerie: 'SER011', clientId: '7' },
      { id_vehicule: 'V012', marque: 'Kia', modele: 'Sportage', annee: 2021, kilometrage: 21000, matricule: 'EFG246', numeroSerie: 'SER012', clientId: '6' }
    ];
  }


  // 🔹 Récupérer tous les véhicules (local)
  getVehicules(): Observable<Vehicule[]> {
    return of(this.vehicules);
  }

  // 🔹 Récupérer un véhicule par ID
  getVehiculeById(id: string): Observable<Vehicule | undefined> {
    const vehicule = this.vehicules.find(v => v.id_vehicule === id);
    return of(vehicule);
  }

  // 🔹 Ajouter un véhicule
  addVehicule(vehicule: Vehicule): Observable<Vehicule> {
    this.vehicules.push(vehicule);
    return of(vehicule);
  }

  // 🔹 Mettre à jour un véhicule
  updateVehicule(id: string, vehiculeUpdates: Partial<Vehicule>): Observable<Vehicule | undefined> {
    const index = this.vehicules.findIndex(v => v.id_vehicule === id);
    if (index !== -1) {
      this.vehicules[index] = { ...this.vehicules[index], ...vehiculeUpdates };
      return of(this.vehicules[index]);
    }
    return of(undefined);
  }

  // 🔹 Supprimer un véhicule
  deleteVehicule(id: string): Observable<boolean> {
    const initialLength = this.vehicules.length;
    this.vehicules = this.vehicules.filter(v => v.id_vehicule !== id);
    return of(this.vehicules.length < initialLength);
  }

  // 🔹 Récupérer les véhicules d'un client spécifique
  getVehiculesByClientId(clientId: string): Observable<Vehicule[]> {
    const filteredVehicules = this.vehicules.filter(v => v.clientId === clientId);
    return of(filteredVehicules);
  }

}
