import { Component, Input } from '@angular/core';
import { Business } from '../../../model/business.model';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { BusinessStatus } from '../../../model/enum/business-status.enum';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-business-element',
  imports: [CardModule, ChipModule, TagModule, DatePipe],
  templateUrl: './business-element.component.html',
  styleUrl: './business-element.component.css'
})
export class BusinessElementComponent {
  @Input() business: Business | null = null;
  get statusSeverity() {
    if(!this.business) return "info";

    if (!this.business.active) return "danger";

    switch (this.business.status) {
      case BusinessStatus.ACTIVE:
        return "success";
      case BusinessStatus.PENDING_PAYMENT:
        return "warn";
      default:
        return "info";
    }
  }

  get statusLabel() {
    if(!this.business) return 'Inactivo';

    return this.business.active ? 'Activo' : 'Inactivo';
  }

  getPlanLabel(plan: string) {
    switch (plan) {
      case 'free':
        return 'Plan Gratis';
      case 'pro':
        return 'Plan Pro';
      case 'enterprise':
        return 'Plan Empresarial';
      default:
        return 'Sin plan';
    }
  }
}
