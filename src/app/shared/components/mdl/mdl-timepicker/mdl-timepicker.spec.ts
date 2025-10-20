import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlTimepicker } from './mdl-timepicker';

describe('MdlTimepicker', () => {
  let component: MdlTimepicker;
  let fixture: ComponentFixture<MdlTimepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlTimepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlTimepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
