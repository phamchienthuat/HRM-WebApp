import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlRadio } from './mdl-radio';

describe('MdlRadio', () => {
  let component: MdlRadio;
  let fixture: ComponentFixture<MdlRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlRadio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
