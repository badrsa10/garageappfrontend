import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface PaginationMeta {
    totalServices: number;
    pageSize: number;
    totalPieces: number;
    currentPage: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Piece {
    id_piece: string;
    libelle: string;
    quantite: number;
}

interface PieceApiResponse {
    data: Piece[];
    meta: PaginationMeta; // optional pagination/meta
}

@Injectable({
    providedIn: 'root'
})
export class PieceService {
    private readonly API_URL = 'http://161.35.45.86:3000/api/piece';

    constructor(private http: HttpClient) {}

    /** Get paginated pieces */
    getPieces(page: number, pageSize: number, search?: string): Observable<PieceApiResponse> {
        let params = new HttpParams().set('page', page).set('limit', pageSize);

        if (search && search.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http.get<PieceApiResponse>(this.API_URL, { params });
    }

    /** Get a piece by ID */
    getPieceById(id: string): Observable<Piece | undefined> {
        return this.http.get<{ data: Piece }>(`${this.API_URL}/${id}`).pipe(
            map((res) => res?.data),
            catchError(this.handleError<Piece | undefined>(`getPieceById id=${id}`, undefined))
        );
    }

    /** Create a new piece */
    createPiece(piece: Piece): Observable<Piece> {
        return this.http.post<Piece>(this.API_URL, piece).pipe(
            map((res) => res) // no catchError here
        );
    }

    /** Update an existing piece */
    updatePiece(id: string, pieceUpdates: Partial<Piece>): Observable<Piece | null> {
        return this.http.put<{ data: Piece }>(`${this.API_URL}/${id}`, pieceUpdates).pipe(
            map((res) => res?.data || null),
            catchError(this.handleError<Piece | null>(`updatePiece id=${id}`, null))
        );
    }

    /** Delete a piece */
    deletePiece(id: string): Observable<boolean> {
        return this.http.delete<{ success: boolean }>(`${this.API_URL}/${id}`).pipe(
            map((res) => res?.success ?? false),
            catchError(this.handleError<boolean>(`deletePiece id=${id}`, false))
        );
    }

    /** Generic error handler */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(`❌ ${operation} failed:`, error.message);

            // Optional: display a user-friendly message via a toast/snackbar service
            // this.toastService.showError(`Error during ${operation}`);

            // Keep app running by returning a safe result
            return throwError(() => error);
        };
    }
}
