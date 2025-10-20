import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlTextarea } from './mdl-textarea';

describe('MdlTextarea', () => {
  let component: MdlTextarea;
  let fixture: ComponentFixture<MdlTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
