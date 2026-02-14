import { Component } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-create-order',
  imports: [FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {
  name: string = "";
  constructor(private orderService: OrderService) {}

  create(){
    this.orderService.createOrder(this.name).subscribe((res)=> {
      console.log("creado: ", res)
    })
  }
}
