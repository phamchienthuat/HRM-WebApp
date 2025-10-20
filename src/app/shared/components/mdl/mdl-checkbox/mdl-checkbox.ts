import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'mdl-checkbox',
  imports: [MatCheckboxModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mdl-checkbox.html',
  styleUrl: './mdl-checkbox.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlCheckbox),
      multi: true,
    },
  ],
})
export class MdlCheckbox implements ControlValueAccessor {
  // Input properties
  @Input() label: string = '';
  @Input() options: Array<any> = [];
  @Input() disabled: boolean = false;
  @Input() control: FormControl | null = null;
  @Input() model: any = '';
  @Input() checked: boolean | null | undefined = false;

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();

  public filteredList: any[] = [];
  filterControl = new FormControl();

  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
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
    this.innerValue = event.checked;
    this.filterControl.setValue('');
    this.onChange(this.innerValue);
    this.onchange.emit(this.innerValue);
  }
}
