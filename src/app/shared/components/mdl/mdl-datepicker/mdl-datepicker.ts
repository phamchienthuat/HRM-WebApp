import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from './custom-date-adapter';

@Component({
  selector: 'mdl-datepicker',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './mdl-datepicker.html',
  styleUrl: './mdl-datepicker.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlDatepicker),
      multi: true
    },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class MdlDatepicker implements ControlValueAccessor {

  // Input properties
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() maxLength!: number;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() requiredMessage: string = 'This field is required.';
  @Input() control: FormControl | null = null;
  @Input() dateFormat: string = "MM/dd/yyyy"; // Input to receive the date format

  @Input() min: any;
  @Input() max: any;

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();
  @Output() onkeydown = new EventEmitter<any>();
  @Output() onblur = new EventEmitter<any>();

  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
  private onChange = (_: any) => { };
  private onTouched = () => { };
  get formControl() {
    return this.control instanceof FormControl ? this.control : new FormControl({ value: this.innerValue, disabled: this.disabled }, this.getValidators());
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
  onInputChange(event: MatDatepickerInputEvent<Date>) {
    this.innerValue = event.value;
    this.onchange.emit(event);
    this.onChange(this.innerValue);
  }

  handleKeydown(event: any): void {
    this.onkeydown.emit(event)
  }

  handleBlur(event: any): void {
    this.onblur.emit(event)
  }
}