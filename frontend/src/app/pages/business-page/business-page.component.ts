import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-business-page',
  imports: [JsonPipe],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.css'
})
export class BusinessPageComponent {
  private businessId: string | null = null;

  business: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService,
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
  }

}
