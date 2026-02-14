import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { JsonPipe } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { firstValueFrom } from 'rxjs';
import { CreateOrderComponent } from "../../components/orders/create-order/create-order.component";

@Component({
  selector: 'app-business-page',
  imports: [JsonPipe, CreateOrderComponent],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.css'
})
export class BusinessPageComponent {
  private businessId: string | null = null;

  business: any;

  orders: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService,
    private orderService: OrderService,
  ) {}

  async ngOnInit() {
    const businessId = this.activatedRoute.snapshot.paramMap.get('businessId');
    this.businessId = businessId;

    this.businessService.getCurrentBusiness().subscribe({
      next: (res) => {
        this.business = res
        console.log(res);
      }
    })
    this.orders = await firstValueFrom(this.orderService.findMany());
  }

}
