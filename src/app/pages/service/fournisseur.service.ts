import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Fournisseur {
  id_fournisseur: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
}

export interface PaginationMeta {
  totalFournisseurs: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface FournisseurApiResponse {
  data: Fournisseur[];
  meta: PaginationMeta;
}

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly API_URL = 'http://161.35.45.86:3000/api/fournisseur';

  constructor(private http: HttpClient) {}

  /** Get paginated fournisseurs with optional search */
  getFournisseurs(page: number, limit: number, search?: string): Observable<FournisseurApiResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<FournisseurApiResponse>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /** Get a single fournisseur by ID */
  getFournisseurById(id: string): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Create a new fournisseur */
  createFournisseur(fournisseur: Omit<Fournisseur, 'id_fournisseur'>): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.API_URL, fournisseur).pipe(
      catchError(this.handleError)
    );
  }

  /** Update an existing fournisseur */
  updateFournisseur(id: string, updates: Partial<Fournisseur>): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.API_URL}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /** Delete a fournisseur */
  deleteFournisseur(id: string): Observable<boolean> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      map(() => true),
      catchError(this.handleError)
    );
  }

  /** Error handler */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Fournisseur API error:', error);
    return throwError(() => error);
  }
}
