import { Component } from '@angular/core';
import { ClerkUserButtonComponent, ClerkUserProfileComponent, ClerkCreateOrganizationComponent } from "ngx-clerk";
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { BusinessService } from '../../services/business.service';
import { Plan } from '../../model/enum/plan.enum';
import { Business } from '../../model/business.model';
import { BusinessElementComponent } from '../../components/business/business-element/business-element.component';
import { BusinessCreateComponent } from '../../components/business/business-create/business-create.component';

@Component({
  selector: 'app-home-page',
  imports: [ClerkUserProfileComponent, ClerkUserButtonComponent, BusinessElementComponent, BusinessCreateComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  info :any;
  businesses: Business[] = [];
  constructor(
    private userService:UserService,
    private businessService:BusinessService
  ){}

  async ngOnInit(){
    this.info = await firstValueFrom(this.userService.getMe());

    this.businesses = await firstValueFrom(this.businessService.getBusinesses());
  }
}
