import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlTable } from './mdl-table';

describe('MdlTable', () => {
  let component: MdlTable;
  let fixture: ComponentFixture<MdlTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdlTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
