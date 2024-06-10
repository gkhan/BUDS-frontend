import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokkabulComponent } from './stokkabul.component';

describe('StokkabulComponent', () => {
  let component: StokkabulComponent;
  let fixture: ComponentFixture<StokkabulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StokkabulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StokkabulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
