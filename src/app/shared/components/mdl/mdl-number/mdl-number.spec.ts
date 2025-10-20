import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlNumber } from './mdl-number';

describe('MdlNumber', () => {
  let component: MdlNumber;
  let fixture: ComponentFixture<MdlNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlNumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
