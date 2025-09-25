/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IniciativeComponent } from './iniciative.component';

describe('IniciativeComponent', () => {
  let component: IniciativeComponent;
  let fixture: ComponentFixture<IniciativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
