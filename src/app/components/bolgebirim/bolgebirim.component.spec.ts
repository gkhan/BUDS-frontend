import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolgebirimComponent } from './bolgebirim.component';

describe('BolgebirimComponent', () => {
  let component: BolgebirimComponent;
  let fixture: ComponentFixture<BolgebirimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolgebirimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BolgebirimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
