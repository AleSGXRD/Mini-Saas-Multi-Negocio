import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-password',
  imports: [MessageModule, FloatLabelModule, PasswordModule, FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  @Input() nameInput: string = 'Password';
  @Input() size: "small" | undefined | "large" = undefined;
  @Input() invalid: boolean = false;
  @Input() touched: boolean = false;
  @Input() submitted: boolean = false;


  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  inputValue: string = '';
  onInputChange() {
    this.valueChange.emit(this.inputValue);
  }
}
