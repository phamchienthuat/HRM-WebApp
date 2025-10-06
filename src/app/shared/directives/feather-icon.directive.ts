import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import feather from 'feather-icons';

type FeatherIconName = keyof typeof feather.icons;

@Directive({
  selector: '[appFeatherIcon]'
})
export class FeatherIconDirective implements OnInit {
  @Input() appFeatherIcon!: FeatherIconName;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const icon = feather.icons[this.appFeatherIcon];
    this.el.nativeElement.innerHTML = icon.toSvg();
  }
}
