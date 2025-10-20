import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'mdl-radio',
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './mdl-radio.html',
  styleUrl: './mdl-radio.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlRadio),
      multi: true,
    },
  ],
})
export class MdlRadio  implements ControlValueAccessor {
  @Input() label: string = "";
  @Input() options: { label: string; value: any }[] = [];
  @Input() disabled: boolean = false;
  @Input() control: FormControl | null = null;
  @Input() model: any = "";
  @Input() checked: boolean | null | undefined = false;
  @Input() labelPosition: "before" | "after" = "after";
  @Input() className: string = "d-flex flex-column";

  @Output() onchange = new EventEmitter();

  innerValue: any;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngOnChanges(changes: SimpleChanges) {}

  get formControl() {
    return this.control instanceof FormControl
      ? this.control
      : new FormControl(this.innerValue, this.getValidators());
  }

  getValidators() {
    return [];
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
    this.innerValue = event;
    this.onChange(this.innerValue);
    this.onchange.emit(this.innerValue);
  }
}
