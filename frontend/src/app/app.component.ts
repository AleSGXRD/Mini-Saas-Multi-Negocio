import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(private _clerk: ClerkService){
    this._clerk.__init({
      publishableKey: environment.CLERK_PUBLISHABLE_KEY,
    })
  }
}
