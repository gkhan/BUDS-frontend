import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmakbuzComponent } from './kmakbuz.component';

describe('KmakbuzComponent', () => {
  let component: KmakbuzComponent;
  let fixture: ComponentFixture<KmakbuzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KmakbuzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KmakbuzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
