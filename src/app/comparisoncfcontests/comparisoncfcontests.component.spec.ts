import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisoncfcontestsComponent } from './comparisoncfcontests.component';

describe('ComparisoncfcontestsComponent', () => {
  let component: ComparisoncfcontestsComponent;
  let fixture: ComponentFixture<ComparisoncfcontestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisoncfcontestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisoncfcontestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
