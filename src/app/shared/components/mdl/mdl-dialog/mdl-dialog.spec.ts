import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlDialog } from './mdl-dialog';

describe('MdlDialog', () => {
  let component: MdlDialog;
  let fixture: ComponentFixture<MdlDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
