import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusCreate } from './bus-create';

describe('BusCreate', () => {
  let component: BusCreate;
  let fixture: ComponentFixture<BusCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(BusCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
