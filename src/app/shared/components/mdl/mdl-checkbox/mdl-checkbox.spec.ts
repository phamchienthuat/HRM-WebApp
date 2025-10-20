import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlCheckbox } from './mdl-checkbox';

describe('MdlCheckbox', () => {
  let component: MdlCheckbox;
  let fixture: ComponentFixture<MdlCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
