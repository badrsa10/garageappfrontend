import { Component, ElementRef, ViewChild } from '@angular/core';
import { Piece, PieceService } from '../../service/pieces.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
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
import { finalize } from 'rxjs/operators';

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
    totalPieces: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;
    pageSize: number = 10;
    loading = true;

    pieceDialog = false;
    editDialog = false;
    deleteDialog = false;

    selectedPiece: Piece | null = null;
    newPiece: Piece = { id_piece: '', libelle: '', quantite: 0 };

    editing: { id: string; field: string } | null = null;

    @ViewChild('filter') filter!: ElementRef;
    totalRecords: number | undefined;
    globalFilter = '';
    selectedPieces: Piece[] = [];

    constructor(
        private pieceService: PieceService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchPieces();
    }

    fetchPieces(page: number = this.currentPage) {
        this.loading = true;
        this.pieceService.getPieces(page, this.pageSize, this.globalFilter).subscribe({
            next: (res) => {
                this.pieces = res.data;
                this.totalPieces = res.meta.totalPieces;
                this.currentPage = res.meta.currentPage;
                this.pageSize = res.meta.pageSize;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load pieces'
                });
            }
        });
    }

    onPageChange(event: any) {
        this.pageSize = event.rows;
        const page = event.first / event.rows + 1;
        this.fetchPieces(page);
    }

    onGlobalFilter(event: Event) {
        const input = event.target as HTMLInputElement;
        this.globalFilter = input.value;
        this.fetchPieces(1); // reset to first page when searching
    }

    /** Clear all filters */
    clear(dt: Table) {
        dt.filterGlobal('', 'contains');
        this.globalFilter = '';
    }

    /** Open dialog to add a new piece */
    openPieceDialog() {
        this.newPiece = { id_piece: '', libelle: '', quantite: 0 };
        this.pieceDialog = true;
    }

    /** Add a new piece via API */
    addPiece() {
        if (!this.newPiece.libelle.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Le libellé est requis'
            });
            return;
        }

        this.pieceService.createPiece(this.newPiece).subscribe({
            next: () => {
                this.fetchPieces();
                this.pieceDialog = false;
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce ajoutée' });
            },
            error: (err) => {
                if (err.status === 409) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Duplicate',
                        detail: 'A piece with this name already exists'
                    });
                } else {
                    console.error('Error adding piece:', err);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l’ajout' });
                }
            }
        });
    }

    /** Open dialog to edit selected piece */
    editPiece(piece: Piece) {
        this.selectedPiece = { ...piece };
        this.editDialog = true;
    }

    /** Save changes from edit dialog */
    savePieceChanges() {
        if (!this.selectedPiece) return;

        this.pieceService
            .updatePiece(this.selectedPiece.id_piece, {
                libelle: this.selectedPiece.libelle,
                quantite: this.selectedPiece.quantite
            })
            .subscribe({
                next: () => {
                    this.fetchPieces();
                    this.editDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce modifiée' });
                },
                error: (err) => {
                    console.error('Error updating piece:', err);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la modification' });
                }
            });
    }

    /** Confirm deletion dialog */
    confirmDelete(piece: Piece) {
        this.selectedPiece = piece;
        this.deleteDialog = true;
    }

    /** Delete selected piece */
    deletePiece() {
        if (!this.selectedPiece) return;

        this.pieceService.deletePiece(this.selectedPiece.id_piece).subscribe({
            next: (success) => {
                if (success) {
                    this.fetchPieces();
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Pièce supprimée' });
                } else {
                    this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'Pièce introuvable' });
                }
                this.deleteDialog = false;
            },
            error: (err) => {
                console.error('Error deleting piece:', err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
            }
        });
    }

    /** Inline cell editing start */
    startEdit(piece: Piece, field: string): void {
        this.editing = { id: piece.id_piece, field };
    }

    /** Is the cell currently being edited? */
    isEditing(piece: Piece, field: string): boolean {
        return this.editing?.id === piece.id_piece && this.editing?.field === field;
    }

    /** Save inline edit directly to backend */
    saveEdit(piece: Piece): void {
        const originalValue = [...this.pieces]; // rollback state if fails

        this.pieceService.updatePiece(piece.id_piece, { quantite: piece.quantite }).subscribe({
            next: (updated) => {
                if (updated) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Quantité mise à jour: ${piece.quantite}`
                    });
                } else {
                    this.pieces = originalValue;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Non modifié',
                        detail: 'Impossible de mettre à jour cette pièce'
                    });
                }
                this.editing = null;
            },
            error: (err) => {
                console.error('Error inline updating piece:', err);
                this.pieces = originalValue; // rollback
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Échec de la mise à jour'
                });
                this.editing = null;
            }
        });
    }

    /** Bulk delete selected pieces */
    deleteSelected() {
        if (!this.selectedPieces.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'No selection',
                detail: 'Please select at least one piece to delete'
            });
            return;
        }

        const idsToDelete = this.selectedPieces.map((p) => p.id_piece);
        const originalPieces = [...this.pieces];

        // Optimistic UI update
        this.pieces = this.pieces.filter((p) => !idsToDelete.includes(p.id_piece));
        this.totalPieces -= idsToDelete.length;

        // Call backend for each delete (or batch if your API supports it)
        idsToDelete.forEach((id) => {
            this.pieceService.deletePiece(id).subscribe({
                next: (success) => {
                    if (!success) {
                        this.pieces = originalPieces; // rollback if any fail
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Delete failed',
                            detail: `Could not delete piece ${id}`
                        });
                    }
                },
                error: () => {
                    this.pieces = originalPieces; // rollback
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Server error while deleting'
                    });
                }
            });
        });

        // Clear selection
        this.selectedPieces = [];
    }
}
