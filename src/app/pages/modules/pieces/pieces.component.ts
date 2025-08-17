import { Component, ElementRef, ViewChild } from '@angular/core';
import { Piece, PieceService } from '../../service/pieces.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'pieces',
    standalone: true,
    providers: [MessageService],
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        DialogModule,
        RouterModule
    ],
    templateUrl: './pieces.component.html'
})
export class PiecesComponent {
    pieces: Piece[] = [];
    loading: boolean = true;
    pieceDialog: boolean = false;
    editDialog: boolean = false;
    deleteDialog: boolean = false;
    selectedPiece: Piece | null = null;

    newPiece: Piece = {
        id_piece: '',
        libelle: '',
        quantite: 0
    };

    editing: { id: string; field: string } | null = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private pieceService: PieceService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchPieces();
    }

    fetchPieces() {
        this.pieceService.getPieces().subscribe({
            next: (pieces) => {
                this.pieces = pieces;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching pieces:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch pieces' });
            }
        });
    }

    /** ✅ Filter pieces globally */
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    /** ✅ Clear all filters */
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    openPieceDialog() {
        this.newPiece = { id_piece: '', libelle: '', quantite: 0 };
        this.pieceDialog = true;
    }

    addPiece() {
        if (this.newPiece.libelle.trim()) {
            this.newPiece.id_piece = (this.pieces.length + 1).toString();
            this.pieceService.createPiece(this.newPiece).subscribe({
                next: () => {
                    this.fetchPieces();
                    this.pieceDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Piece added' });
                },
                error: (err) => {
                    console.error('Error adding piece:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add piece' });
                }
            });
        }
    }

    editPiece(piece: Piece) {
        this.selectedPiece = { ...piece };
        this.editDialog = true;
    }

    savePieceChanges() {
        if (this.selectedPiece) {
            this.pieceService.updatePiece(this.selectedPiece.id_piece, this.selectedPiece).subscribe({
                next: () => {
                    this.fetchPieces();
                    this.editDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Piece updated' });
                },
                error: (err) => {
                    console.error('Error updating piece:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update piece' });
                }
            });
        }
    }

    confirmDelete(piece: Piece) {
        this.selectedPiece = piece;
        this.deleteDialog = true;
    }

    deletePiece() {
        if (this.selectedPiece) {
            this.pieceService.deletePiece(this.selectedPiece.id_piece).subscribe({
                next: () => {
                    this.fetchPieces();
                    this.deleteDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Piece deleted' });
                },
                error: (err) => {
                    console.error('Error deleting piece:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete piece' });
                }
            });
        }
    }

    

    startEdit(piece: Piece, field: string): void {
        this.editing = { id: piece.id_piece, field };
    }

    isEditing(piece: Piece, field: string): boolean {
        return this.editing?.id === piece.id_piece && this.editing?.field === field;
    }

    saveEdit(piece: Piece): void {
        console.log(`Quantité mise à jour pour ${piece.libelle}: ${piece.quantite}`);
        // 🔹 Call your API or service here for persistence
        this.editing = null;
    }
}
