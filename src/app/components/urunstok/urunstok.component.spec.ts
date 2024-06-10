import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrunstokComponent } from './urunstok.component';

describe('UrunstokComponent', () => {
  let component: UrunstokComponent;
  let fixture: ComponentFixture<UrunstokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrunstokComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrunstokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
