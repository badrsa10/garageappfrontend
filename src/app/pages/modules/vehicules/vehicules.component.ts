import { Component } from '@angular/core';
import { TableVehiculesComponent } from './table-vehicules/table-vehicules.component';

@Component({
  selector: 'vehicules',
  imports: [TableVehiculesComponent],
  templateUrl: './vehicules.component.html',
  //styleUrl: './vehicules.component.scss'
})
export class VehiculesComponent {

}
