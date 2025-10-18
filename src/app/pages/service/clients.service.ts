import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Client {
  id_client: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  type_personne: string;
}

export interface PaginationMeta {
  totalClients: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface ClientApiResponse {
  map(arg0: (c: any) => { id_client: any; fullName: string; }): { id_client: string; fullName: string; }[];
  data: Client[];
  meta: PaginationMeta;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = 'http://http://167.99.90.103:3000/api/client';

  constructor(private http: HttpClient) {}

  /** Get paginated clients with optional search */
  getClients(page: number, limit: number, search?: string): Observable<ClientApiResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ClientApiResponse>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /** Get a single client by ID */
  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Create a new client */
  createClient(client: Omit<Client, 'id_client'>): Observable<Client> {
    return this.http.post<Client>(this.API_URL, client).pipe(
      catchError(this.handleError)
    );
  }

  /** Update an existing client */
  updateClient(id: string, updates: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /** Delete a client */
  deleteClient(id: string): Observable<boolean> {
    return this.http.delete<{ success: boolean }>(`${this.API_URL}/${id}`).pipe(
      map(res => res.success ?? false),
      catchError(this.handleError)
    );
  }

  /** Error handler */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Client API error:', error);
    return throwError(() => error);
  }
}
