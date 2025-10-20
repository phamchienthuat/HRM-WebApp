import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlDatepicker } from './mdl-datepicker';

describe('MdlDatepicker', () => {
  let component: MdlDatepicker;
  let fixture: ComponentFixture<MdlDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlDatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
