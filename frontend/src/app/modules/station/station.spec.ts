import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Station } from './station';

describe('Station', () => {
  let component: Station;
  let fixture: ComponentFixture<Station>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Station],
    }).compileComponents();

    fixture = TestBed.createComponent(Station);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
