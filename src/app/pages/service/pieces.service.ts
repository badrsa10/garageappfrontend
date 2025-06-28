import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define the Piece model
export interface Piece {
  id_piece: string;
  libelle: string;
  quantite: number;
}

@Injectable({
  providedIn: 'root'
})

export class PieceService {
  private pieces: Piece[] = this.getData(); // Initialize with mock data

  constructor() {}

  // Mock data function
  getData(): Piece[] {
    return [
      { id_piece: '1', libelle: 'Brake Pads', quantite: 15 },
      { id_piece: '2', libelle: 'Oil Filter', quantite: 30 },
      { id_piece: '3', libelle: 'Headlights', quantite: 10 },
      { id_piece: '4', libelle: 'Tires', quantite: 25 },
      { id_piece: '5', libelle: 'Windshield Wipers', quantite: 40 },
      { id_piece: '6', libelle: 'Spark Plugs', quantite: 50 },
      { id_piece: '7', libelle: 'Batteries', quantite: 20 },
      { id_piece: '8', libelle: 'Radiators', quantite: 8 },
      { id_piece: '9', libelle: 'Clutch Kit', quantite: 12 },
      { id_piece: '10', libelle: 'Alternators', quantite: 9 },
      { id_piece: '11', libelle: 'Fuel Pump', quantite: 14 },
      { id_piece: '12', libelle: 'Exhaust System', quantite: 5 },
    ];
  }
  

  // Get all pieces
  getPieces(): Observable<Piece[]> {
    return of(this.pieces);
  }

  // Get a piece by ID
  getPieceById(id: string): Observable<Piece | undefined> {
    const piece = this.pieces.find(p => p.id_piece === id);
    return of(piece);
  }

  // Create a new piece
  createPiece(piece: Piece): Observable<Piece> {
    this.pieces.push(piece);
    return of(piece);
  }

  // Update an existing piece
  updatePiece(id: string, pieceUpdates: Partial<Piece>): Observable<Piece | undefined> {
    const pieceIndex = this.pieces.findIndex(p => p.id_piece === id);
    if (pieceIndex !== -1) {
      this.pieces[pieceIndex] = { ...this.pieces[pieceIndex], ...pieceUpdates };
      return of(this.pieces[pieceIndex]);
    }
    return of(undefined);
  }

  // Delete a piece
  deletePiece(id: string): Observable<boolean> {
    const initialLength = this.pieces.length;
    this.pieces = this.pieces.filter(p => p.id_piece !== id);
    return of(this.pieces.length < initialLength);
  }
}
