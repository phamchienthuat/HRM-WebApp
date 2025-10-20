import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Inject, OnInit, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mdl-dialog',
  imports: [FormsModule, CommonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './mdl-dialog.html',
  styleUrl: './mdl-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MdlDialog implements OnInit {
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  dialogSize: string = 'md';

  constructor(
    public dialogRef: MatDialogRef<MdlDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      bodyComponent: any;
      state: string;
      data: any;
      size: string;
      inputs: any[];
      outputs: any[];
    }
  ) {}

  ngOnInit(): void {
    this.container.clear();
    const componentRef: ComponentRef<any> = this.container.createComponent(this.data.bodyComponent);
    this.data.inputs?.map((input) => {
      componentRef.instance[input.key] = input.value;
    });

    this.data.outputs?.map((output) => {
      componentRef.instance[output.key]?.subscribe((event: any) => {
        output.callback(event);
      });
    });
    this.dialogSize = this.data.size ? this.data.size : 'md';
  }

  onSave() {
    this.dialogRef.close({ action: 'save' });
  }

  onClose() {
    this.dialogRef.close({ action: 'close' });
  }
}
