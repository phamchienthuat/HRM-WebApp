import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'mdl-number',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './mdl-number.html',
  styleUrl: './mdl-number.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlNumber),
      multi: true
    },
  ]
})
export class MdlNumber implements ControlValueAccessor {

  // Input properties
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() maxLength!: number;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number = 1;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() requiredMessage: string = 'This field is required.';
  @Input() control: FormControl | null = null;

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();
  @Output() onblur = new EventEmitter<any>();

  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
  private onChange = (_: any) => { };
  private onTouched = () => { };
  get formControl() {
    return this.control instanceof FormControl ? this.control : new FormControl({value: this.innerValue, disabled: this.disabled}, this.getValidators());
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
    this.onchange.emit(event);
    this.onChange(this.innerValue);
  }

  handleBlur(event: Event): void {
    this.onblur.emit(event)
  }
}
