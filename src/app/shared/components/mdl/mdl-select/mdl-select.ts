import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'mdl-select',
  imports: [   
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './mdl-select.html',
  styleUrl: './mdl-select.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlSelect),
      multi: true
    },
  ]
})
export class MdlSelect  implements ControlValueAccessor, OnInit {

  // Input properties
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() maxLength!: number;
  @Input() options!: any[];
  @Input() multiple: boolean = false;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() requiredMessage: string = 'This field is required.';
  @Input() control: FormControl | null = null;

  @Input() valueField: string = 'value';
  @Input() textField: string = 'text';

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();


  public filteredList: {id: any; name: string}[] = [];
  newOptions: { id: any; name: string }[] = [];

  filterControl = new FormControl();

  searchControl = new FormControl('');


  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
  private onChange = (_: any) => { };
  private onTouched = () => { };

  ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
      const lowerCaseTerm = value?.toLowerCase() || '';
      this.filteredList = this.newOptions.filter((option) =>
        option.name.toLowerCase().includes(lowerCaseTerm)
      );
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.options) {
      this.newOptions = this.options.map((item: any) => {
        return {
          id: item[this.valueField],
          name: item[this.textField]
        }
      });
      this.filteredList = this.newOptions?.slice()

    }
  }

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

  onChangeValue(event: any) {
    this.innerValue = event.value
    this.filterControl.setValue('');
    this.onchange.emit(event);
    this.onChange(this.innerValue)
  }

  openedChange(isOpen: any) {
    if (!isOpen) {
      this.searchControl.setValue('')
    }
  }
}
