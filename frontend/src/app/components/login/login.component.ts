import { Component } from '@angular/core';
import { PasswordComponent } from '../form/password/password.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [PasswordComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form : any;
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)]
    })
  }
}
