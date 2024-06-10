import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakbuzComponent } from './makbuz.component';

describe('MakbuzComponent', () => {
  let component: MakbuzComponent;
  let fixture: ComponentFixture<MakbuzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakbuzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakbuzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
