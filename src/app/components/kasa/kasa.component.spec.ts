import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KasaComponent } from './kasa.component';

describe('KasaComponent', () => {
  let component: KasaComponent;
  let fixture: ComponentFixture<KasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KasaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
