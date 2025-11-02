// service/marque-model.service.ts
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
    private API_URL = 'http://167.99.90.103:3000/api/marqueModel';

    constructor(private http: HttpClient) {}

    getAll(): Observable<MarqueModel[]> {
        return this.http.get<{ data: MarqueModel[] }>(`${this.API_URL}?limit=100&page=1`).pipe(map((res) => res.data));
    }
}
