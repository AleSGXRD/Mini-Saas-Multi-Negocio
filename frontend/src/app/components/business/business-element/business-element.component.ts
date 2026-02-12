import { Component, Input, SimpleChanges } from '@angular/core';
import { Business } from '../../../model/business.model';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { BusinessStatus } from '../../../model/enum/business-status.enum';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BusinessService } from '../../../services/business.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-business-element',
  imports: [CardModule, ChipModule, TagModule, DatePipe, RouterLink],
  templateUrl: './business-element.component.html',
  styleUrl: './business-element.component.css'
})
export class BusinessElementComponent {
  @Input() business: Business | null = null;
  url: string ='';
  /**
   *
   */
  constructor(private businessService: BusinessService) {
  }
  async ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(!this.business) return;

    if(this.business.status == BusinessStatus.PENDING_PAYMENT){
      const checkoutUrl = await firstValueFrom(this.businessService.getCheckoutUrl(this.business.publicId));
      console.log(checkoutUrl);
      this.url = checkoutUrl.url;
    }
    else{
      this.url = `business/${this.business.publicId}`;
    }
  }
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
  get statusText(){
    if(!this.business) return "Inactivo";

    switch (this.business.status) {
      case BusinessStatus.ACTIVE:
        return "Activo";
      case BusinessStatus.PENDING_PAYMENT:
        return "Pendiente de Pago";
      default:
        return "Inactivo";
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
