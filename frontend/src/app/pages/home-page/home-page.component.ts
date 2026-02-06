import { Component } from '@angular/core';
import { ClerkUserButtonComponent, ClerkUserProfileComponent, ClerkCreateOrganizationComponent } from "ngx-clerk";
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { BusinessService } from '../../services/business.service';
import { Plan } from '../../model/enum/plan.enum';

@Component({
  selector: 'app-home-page',
  imports: [ClerkUserProfileComponent, ClerkUserButtonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  info :any;
  constructor(private userService:UserService,
    private businessService:BusinessService
  ){

  }

  async ngOnInit(){
    this.info = await firstValueFrom(this.userService.getMe());

    const businesses = await firstValueFrom(this.businessService.getBusinesses());
    this.createBusiness().subscribe(res=>{
      if(res.checkoutUrl){
        window.location.href = res.checkoutUrl;
      }
      console.log('Business created', res);
    })
  }

  createBusiness(){
    return this.businessService.createBusiness({
      name: 'New Business',
      plan: Plan.PRO
    })
  }


}
