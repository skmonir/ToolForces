import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareojsolutioncountComponent } from './compareojsolutioncount.component';

describe('CompareojsolutioncountComponent', () => {
  let component: CompareojsolutioncountComponent;
  let fixture: ComponentFixture<CompareojsolutioncountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareojsolutioncountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareojsolutioncountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
