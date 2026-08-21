import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusView } from './bus-view';

describe('BusView', () => {
  let component: BusView;
  let fixture: ComponentFixture<BusView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusView],
    }).compileComponents();

    fixture = TestBed.createComponent(BusView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
