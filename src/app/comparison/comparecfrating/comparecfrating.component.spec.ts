import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparecfratingComponent } from './comparecfrating.component';

describe('ComparecfratingComponent', () => {
  let component: ComparecfratingComponent;
  let fixture: ComponentFixture<ComparecfratingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparecfratingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparecfratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
