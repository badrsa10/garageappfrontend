import { Component, ElementRef, ViewChild } from '@angular/core';
import { Service, ServiceService } from '../../service/services.service';
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
  selector: 'app-services',
  standalone: true,
  imports: [TableModule,
    MessageService,
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
          RouterModule],
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  services: Service[] = [];
  loading: boolean = true;
  serviceDialog: boolean = false;
  editDialog: boolean = false;
  deleteDialog: boolean = false;
  selectedService: Service | null = null;

  // ✅ Define newService with default values
  newService: Service = {
    id_service: '',
    libelle: ''
  };
  // @ViewChild('dt') dt!: Table; // ✅ Ensure Table is correctly referenced
  @ViewChild('filter') filter!: ElementRef;

  constructor(private serviceService: ServiceService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  /** ✅ Fetch all services */
  fetchServices() {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch services' });
      }
    });
  }

  /** ✅ Filter services globally */
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /** ✅ Clear all filters */
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  /** ✅ Open add service dialog */
  openServiceDialog() {
    this.newService = { id_service: '', libelle: '' };
    this.serviceDialog = true;
  }

  /** ✅ Add a new service */
  addService() {
    if (this.newService.libelle.trim()) {
      this.newService.id_service = (this.services.length + 1).toString();
      this.serviceService.createService(this.newService).subscribe({
        next: () => {
          this.fetchServices();
          this.serviceDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added' });
        },
        error: (err) => {
          console.error('Error adding service:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add service' });
        }
      });
    }
  }

  /** ✅ Open edit service dialog */
  editService(service: Service) {
    this.selectedService = { ...service };
    this.editDialog = true;
  }

  /** ✅ Save service updates */
  saveServiceChanges() {
    if (this.selectedService) {
      this.serviceService.updateService(this.selectedService.id_service, this.selectedService).subscribe({
        next: () => {
          this.fetchServices();
          this.editDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service updated' });
        },
        error: (err) => {
          console.error('Error updating service:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update service' });
        }
      });
    }
  }

  /** ✅ Open delete confirmation */
  confirmDelete(service: Service) {
    this.selectedService = service;
    this.deleteDialog = true;
  }

  /** ✅ Delete service */
  deleteService() {
    if (this.selectedService) {
      this.serviceService.deleteService(this.selectedService.id_service).subscribe({
        next: () => {
          this.fetchServices();
          this.deleteDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service deleted' });
        },
        error: (err) => {
          console.error('Error deleting service:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete service' });
        }
      });
    }
  }


}
