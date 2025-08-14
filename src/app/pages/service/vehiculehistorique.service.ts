import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface VehiculeHistorique {
  id_vehicule_historique: string;
  vehiculeId?: string;
  date_historique: string; // ISO-8601
  kilometrage?: number;
  pieceId?: string;
  serviceId?: string;
  libelle_pieceouservice?: string;
  remarque?: string;
}

export const MOCK_VEHICULE_HISTORIQUES: VehiculeHistorique[] = [
  { id_vehicule_historique: 'VH001', vehiculeId: 'V001', date_historique: '2023-05-10T00:00:00.000Z', kilometrage: 50000, libelle_pieceouservice: 'Vidange huile moteur', remarque: 'Huile 5W-30 + filtre remplacé' },
  { id_vehicule_historique: 'VH002', vehiculeId: 'V001', date_historique: '2024-02-15T00:00:00.000Z', kilometrage: 58000, libelle_pieceouservice: 'Remplacement plaquettes avant', remarque: 'Freinage optimisé' },
  { id_vehicule_historique: 'VH003', vehiculeId: 'V002', date_historique: '2023-07-20T00:00:00.000Z', kilometrage: 38000, libelle_pieceouservice: 'Changement pneus avant', remarque: 'Pneus Michelin Primacy' },
  { id_vehicule_historique: 'VH004', vehiculeId: 'V002', date_historique: '2024-03-18T00:00:00.000Z', kilometrage: 44000, libelle_pieceouservice: 'Contrôle technique', remarque: 'Aucune anomalie détectée' },
  { id_vehicule_historique: 'VH005', vehiculeId: 'V003', date_historique: '2023-09-05T00:00:00.000Z', kilometrage: 22000, libelle_pieceouservice: 'Entretien transmission', remarque: 'Huile boîte changée' },
  { id_vehicule_historique: 'VH006', vehiculeId: 'V004', date_historique: '2023-11-22T00:00:00.000Z', kilometrage: 30000, libelle_pieceouservice: 'Remplacement batterie', remarque: 'Batterie Bosch garantie 3 ans' },
  { id_vehicule_historique: 'VH007', vehiculeId: 'V005', date_historique: '2024-01-12T00:00:00.000Z', kilometrage: 14000, libelle_pieceouservice: 'Révision complète', remarque: 'Filtres, huile, freins vérifiés' },
  { id_vehicule_historique: 'VH008', vehiculeId: 'V006', date_historique: '2023-06-28T00:00:00.000Z', kilometrage: 45000, libelle_pieceouservice: 'Nettoyage circuit de refroidissement', remarque: 'Liquide remplacé' },
  { id_vehicule_historique: 'VH009', vehiculeId: 'V007', date_historique: '2024-04-14T00:00:00.000Z', kilometrage: 53000, libelle_pieceouservice: 'Changement amortisseurs avant', remarque: 'Amortisseurs Bilstein installés' },
  { id_vehicule_historique: 'VH010', vehiculeId: 'V008', date_historique: '2023-12-01T00:00:00.000Z', kilometrage: 10000, libelle_pieceouservice: 'Installation attelage remorque', remarque: 'Homologation OK' },
  { id_vehicule_historique: 'VH011', vehiculeId: 'V009', date_historique: '2024-02-05T00:00:00.000Z', kilometrage: 38000, libelle_pieceouservice: 'Remplacement courroie accessoire', remarque: 'Tension réglée' },
  { id_vehicule_historique: 'VH012', vehiculeId: 'V010', date_historique: '2023-10-16T00:00:00.000Z', kilometrage: 27000, libelle_pieceouservice: 'Changement filtres à air et habitacle', remarque: 'Filtre à air sport installé' },
  { id_vehicule_historique: 'VH013', vehiculeId: 'V011', date_historique: '2024-03-01T00:00:00.000Z', kilometrage: 35000, libelle_pieceouservice: 'Recharge climatisation', remarque: 'Gaz R134a ajouté' },
  { id_vehicule_historique: 'VH014', vehiculeId: 'V012', date_historique: '2023-08-08T00:00:00.000Z', kilometrage: 19000, libelle_pieceouservice: 'Vidange boîte automatique', remarque: 'Huile ATF neuve' }
];

// vehicule-historique.service.ts


@Injectable({ providedIn: 'root' })
export class VehiculeHistoriqueService {
  private historiques: VehiculeHistorique[] = [...MOCK_VEHICULE_HISTORIQUES];

  constructor() {}

  // 🔹 Récupérer tous les historiques
  getVehiculeHistoriques(): Observable<VehiculeHistorique[]> {
    return of([...this.historiques]);
  }

  // 🔹 Récupérer un historique par ID
  getVehiculeHistoriqueById(id: string): Observable<VehiculeHistorique | undefined> {
    return of(this.historiques.find(h => h.id_vehicule_historique === id));
  }

  // 🔹 Récupérer les historiques d’un véhicule
  getVehiculeHistoriquesByVehiculeId(vehiculeId: string): Observable<VehiculeHistorique[]> {
    return of(this.historiques.filter(h => h.vehiculeId === vehiculeId));
  }

  // 🔹 Ajouter un historique
  addVehiculeHistorique(payload: Omit<VehiculeHistorique, 'id_vehicule_historique'>): Observable<VehiculeHistorique> {
    const entity: VehiculeHistorique = {
      id_vehicule_historique: this.nextId(),
      ...payload
    };
    this.historiques = [...this.historiques, entity];
    return of(entity);
  }

  // 🔹 Mettre à jour un historique
  updateVehiculeHistorique(id: string, updates: Partial<VehiculeHistorique>): Observable<VehiculeHistorique | undefined> {
    const index = this.historiques.findIndex(h => h.id_vehicule_historique === id);
    if (index === -1) return of(undefined);

    const updated = { ...this.historiques[index], ...updates };
    this.historiques = [
      ...this.historiques.slice(0, index),
      updated,
      ...this.historiques.slice(index + 1)
    ];
    return of(updated);
  }

  // 🔹 Supprimer un historique
  deleteVehiculeHistorique(id: string): Observable<boolean> {
    const before = this.historiques.length;
    this.historiques = this.historiques.filter(h => h.id_vehicule_historique !== id);
    return of(this.historiques.length < before);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private nextId(): string {
    const max = this.historiques.reduce((acc, h) => {
      const n = parseInt(h.id_vehicule_historique.replace(/\D/g, ''), 10);
      return isNaN(n) ? acc : Math.max(acc, n);
    }, 0);
    return `VH${String(max + 1).padStart(3, '0')}`;
  }
}
