import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Vehicule {
    id_vehicule: string;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    matricule: string;
    numeroSerie: string;
    clientId?: string;
}

export interface PaginationMeta {
    totalVehicules: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface VehiculeApiResponse {
    data: Vehicule[];
    meta: PaginationMeta;
}

@Injectable({
    providedIn: 'root'
})
export class VehiculeService {
    private readonly API_URL = 'http://167.99.90.103:3000/api/vehicule';

    constructor(private http: HttpClient) {}

    /** Get paginated vehicules with optional search */
    getVehicules(page: number, limit: number, search?: string): Observable<VehiculeApiResponse> {
        let params = new HttpParams().set('page', page).set('limit', limit);

        if (search?.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http.get<VehiculeApiResponse>(this.API_URL, { params }).pipe(catchError(this.handleError));
    }

    /** Get a single vehicule by ID */
    getVehiculeById(id: string): Observable<Vehicule> {
        return this.http.get<Vehicule>(`${this.API_URL}/${id}`).pipe(catchError(this.handleError));
    }

    /** Create a new vehicule */
    createVehicule(vehicule: Omit<Vehicule, 'id_vehicule'>): Observable<Vehicule> {
        return this.http.post<Vehicule>(this.API_URL, vehicule).pipe(catchError(this.handleError));
    }

    /** Update an existing vehicule */
    updateVehicule(id: string, updates: Partial<Vehicule>): Observable<Vehicule> {
        return this.http.put<Vehicule>(`${this.API_URL}/${id}`, updates).pipe(catchError(this.handleError));
    }

    /** Delete a vehicule */
    deleteVehicule(id: string): Observable<boolean> {
        return this.http.delete<{ success: boolean }>(`${this.API_URL}/${id}`).pipe(
            map((res) => res.success ?? false),
            catchError(this.handleError)
        );
    }

    /** 🔍 Get vehicules filtered by clientId */
    getVehiculesByClientId(clientId: string): Observable<Vehicule[]> {
        const params = new HttpParams().set('clientId', clientId);
        return this.http.get<{ data: Vehicule[] }>(this.API_URL, { params }).pipe(
            map((res) => res.data),
            catchError(this.handleError)
        );
    }

    /** Error handler */
    private handleError(error: HttpErrorResponse) {
        console.error('❌ Vehicule API error:', error);
        console.log('error api: ', JSON.stringify(error, null, 2));
        return throwError(() => error);
    }
}
