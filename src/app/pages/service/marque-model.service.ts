import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface MarqueModel {
  id: string;
  marque: string;
  model: string;
}

@Injectable({ providedIn: 'root' })
export class MarqueModelService {
  private API_URL = 'http://161.35.45.86:3000/api/marqueModel';

  constructor(private http: HttpClient) {}

  // ✅ Fetch all marque/model pairs
  getAll(): Observable<MarqueModel[]> {
    return this.http.get<{ data: MarqueModel[] }>(`${this.API_URL}?limit=1000&page=1`)
      .pipe(map(res => res.data));
  }

  // ✅ Fetch unique marques only
  getAllMarques(): Observable<string[]> {
    return this.getAll().pipe(
      map(models => [...new Set(models.map(m => m.marque))])
    );
  }

  // ✅ Fetch models by selected marque
  getModelsByMarque(marque: string): Observable<string[]> {
    return this.getAll().pipe(
      map(models => models
        .filter(m => m.marque === marque)
        .map(m => m.model))
    );
  }
}
