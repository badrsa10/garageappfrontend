import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface VehiculeHistorique {
    id_vehicule_historique: string;
    vehiculeId?: string;
    date_historique: Date;
    kilometrage?: number;
    pieceId?: string | null;
    serviceId?: string | null;
    libelle_pieceouservice?: string;
    remarque?: string;
}

export interface PaginationMeta {
    totalHistorique: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface VehiculeHistoriqueApiResponse {
    data: VehiculeHistorique[];
    meta: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class VehiculeHistoriqueService {
    private readonly API_URL = 'http://167.99.90.103:3000/api/vehicule_historique';

    constructor(private http: HttpClient) {}

    /** 🔹 Get paginated historiques with optional search and vehiculeId */
    getHistorique(page: number, limit: number, search?: string, vehiculeId?: string): Observable<VehiculeHistoriqueApiResponse> {
        let params = new HttpParams().set('page', page).set('limit', limit);

        if (search?.trim()) {
            params = params.set('search', search.trim());
        }

        if (vehiculeId) {
            params = params.set('vehiculeId', vehiculeId);
        }

        return this.http.get<VehiculeHistoriqueApiResponse>(this.API_URL, { params }).pipe(catchError(this.handleError));
    }

    /** 🔹 Get a single historique by ID */
    getHistoriqueById(id: string): Observable<VehiculeHistorique> {
        return this.http.get<VehiculeHistorique>(`${this.API_URL}/${id}`).pipe(catchError(this.handleError));
    }

    /** 🔹 Create a new historique */
    createHistorique(payload: Omit<VehiculeHistorique, 'id_vehicule_historique'>): Observable<VehiculeHistorique> {
        return this.http.post<VehiculeHistorique>(this.API_URL, payload).pipe(catchError(this.handleError));
    }

    /** 🔹 Update an existing historique */
    updateHistorique(id: string, updates: Partial<VehiculeHistorique>): Observable<VehiculeHistorique> {
        return this.http.put<VehiculeHistorique>(`${this.API_URL}/${id}`, updates).pipe(catchError(this.handleError));
    }

    /** 🔹 Delete a historique */
    deleteHistorique(id: string): Observable<boolean> {
        return this.http.delete<{ success: boolean }>(`${this.API_URL}/${id}`).pipe(
            map((res) => res?.success === true),
            catchError(this.handleError)
        );
    }

    /** 🔹 Fetch historiques for a specific vehicule via query param */
    getVehiculeHistoriquesByVehiculeId(vehiculeId: string): Observable<VehiculeHistorique[]> {
        const params = new HttpParams().set('vehiculeId', vehiculeId);
        return this.http.get<{ data: VehiculeHistorique[] }>(this.API_URL, { params }).pipe(
            map((res) => res.data),
            catchError(this.handleError)
        );
    }

    /** 🔧 Error handler */
    private handleError(error: HttpErrorResponse) {
        console.error('❌ Historique API error:', error);
        return throwError(() => error);
    }
}
