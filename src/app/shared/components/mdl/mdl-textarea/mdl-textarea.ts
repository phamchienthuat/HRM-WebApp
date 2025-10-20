import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'mdl-textarea',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './mdl-textarea.html',
  styleUrl: './mdl-textarea.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlTextarea),
      multi: true,
    },
  ],
})
export class MdlTextarea implements ControlValueAccessor {
  // textarea properties
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() maxLength!: number;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() requiredMessage: string = 'This field is required.';
  @Input() control: FormControl | null = null;

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();

  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
  private onChange = (_: any) => {};
  private onTouched = () => {};
  get formControl() {
    return this.control instanceof FormControl
      ? this.control
      : new FormControl(this.innerValue, this.getValidators());
  }

  getValidators() {
    const validators = [];
    if (this.required) {
      validators.push(Validators.required);
    }
    if (this.maxLength) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    return validators;
  }

  writeValue(value: any): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Update value on user input and emit change event
  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.innerValue = target.value;
    this.onChange(this.innerValue);
    this.onchange.emit(this.innerValue);
  }
}
