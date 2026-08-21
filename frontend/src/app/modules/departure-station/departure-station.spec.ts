import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureStation } from './departure-station';

describe('DepartureStation', () => {
  let component: DepartureStation;
  let fixture: ComponentFixture<DepartureStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartureStation],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartureStation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
