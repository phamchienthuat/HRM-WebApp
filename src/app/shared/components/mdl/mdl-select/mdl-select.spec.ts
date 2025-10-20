import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlSelect } from './mdl-select';

describe('MdlSelect', () => {
  let component: MdlSelect;
  let fixture: ComponentFixture<MdlSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
