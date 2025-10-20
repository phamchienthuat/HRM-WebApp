import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'mdl-timepicker',
  imports: [
     CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './mdl-timepicker.html',
  styleUrl: './mdl-timepicker.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlTimepicker),
      multi: true
    },
  ]
})
export class MdlTimepicker implements ControlValueAccessor {

  // Input properties
  @Input() label: string = '';
  @Input() placeholder: string = '';

  @Input() min: string = '';
  @Input() max: string = '';
  @Input() format: string = '';

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

  onChangeValue(event: any) {
    this.innerValue = event
    this.onchange.emit(event);
    this.onChange(this.innerValue)
  }
}
