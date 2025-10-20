import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlTab } from './mdl-tab';

describe('MdlTab', () => {
  let component: MdlTab;
  let fixture: ComponentFixture<MdlTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
