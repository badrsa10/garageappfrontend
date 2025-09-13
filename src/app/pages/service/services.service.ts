import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

export interface PaginationMeta {
  totalServices: number; // ✅ matches backend
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface Service {
  id_service: string;
  libelle: string;
}

interface ServiceApiResponse {
  data: Service[];
  meta: PaginationMeta;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly API_URL = 'http://localhost:3000/api/service';

  constructor(private http: HttpClient) {}

  /** Get paginated services */
  getServices(page: number, limit: number, search?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ServiceApiResponse>(this.API_URL, { params });
  }

  /** Create service — backend returns raw object */
  createService(service: Omit<Service, 'id_service'>) {
    return this.http.post<Service>(this.API_URL, service);
  }

  /** Update service — backend returns raw object */
  updateService(id: string, updates: Partial<Service>) {
    return this.http.put<Service>(`${this.API_URL}/${id}`, updates);
  }

  /** Delete service */
  deleteService(id: string) {
    return this.http.delete<{ success: boolean }>(`${this.API_URL}/${id}`);
  }
}
