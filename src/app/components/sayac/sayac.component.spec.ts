import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SayacComponent } from './sayac.component';

describe('SayacComponent', () => {
  let component: SayacComponent;
  let fixture: ComponentFixture<SayacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SayacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SayacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
