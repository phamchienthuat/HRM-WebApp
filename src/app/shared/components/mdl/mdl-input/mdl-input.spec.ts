import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlInput } from './mdl-input';

describe('MdlInput', () => {
  let component: MdlInput;
  let fixture: ComponentFixture<MdlInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
