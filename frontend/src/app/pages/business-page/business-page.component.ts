import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-page',
  imports: [],
  templateUrl: './business-page.component.html',
  styleUrl: './business-page.component.css'
})
export class BusinessPageComponent {
  private businessId: string | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService,
  ) {}

  async ngOnInit() {
    const businessId = this.activatedRoute.snapshot.paramMap.get('businessId');
    this.businessId = businessId;

    this.businessService.getCurrentBusiness().subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

}
