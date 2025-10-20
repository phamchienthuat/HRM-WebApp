import { CommonModule } from "@angular/common";
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { MatTabsModule } from '@angular/material/tabs';

type Tab = {
  id: any;
  label: string;
  content?: any;
  template?: any;
};

@Component({
  selector: 'mdl-tab',
  imports: [ CommonModule, MatTabsModule],
  templateUrl: './mdl-tab.html',
  styleUrl: './mdl-tab.scss'
})
export class MdlTab  implements OnInit {
  @Input() tabs: Tab[] = [];

  @Output() onSelectTab: EventEmitter<any> = new EventEmitter();
  activeTabId: string = "";
  selectedTab: number = 0;

  @ContentChild(TemplateRef) parentTemplate!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {
    if (this.tabs.length) {
      this.activeTabId = this.tabs[0].id;
    }
    console.log(this.tabs);
  }

  ngAfterContentInit() {}

  onTabClick(e: any) {
    const id = this.tabs[e.index].id;

    this.activeTabId = id;
    this.onSelectTab.emit(id);
  }
}
