import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Departure } from './departure';

describe('Departure', () => {
  let component: Departure;
  let fixture: ComponentFixture<Departure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departure],
    }).compileComponents();

    fixture = TestBed.createComponent(Departure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
