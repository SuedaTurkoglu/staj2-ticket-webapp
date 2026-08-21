import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCombination } from './station-combination';

describe('StationCombination', () => {
  let component: StationCombination;
  let fixture: ComponentFixture<StationCombination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationCombination],
    }).compileComponents();

    fixture = TestBed.createComponent(StationCombination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
