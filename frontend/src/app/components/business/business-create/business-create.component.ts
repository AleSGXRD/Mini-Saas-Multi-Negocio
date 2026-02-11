import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BusinessService } from '../../../services/business.service';
import { Plan } from '../../../model/enum/plan.enum';

@Component({
  selector: 'app-business-create',
  imports: [CardModule],
  templateUrl: './business-create.component.html',
  styleUrl: './business-create.component.css'
})
export class BusinessCreateComponent {
  constructor(private businessService:BusinessService){}

  handleClick(){
    this.createBusiness().subscribe((value) => {
      console.log(value);
      window.location.href = value.checkoutUrl;
    });
  }

  createBusiness(){
    return this.businessService.createBusiness({
      name: 'New Business',
      plan: Plan.PRO
    })
  }
}
