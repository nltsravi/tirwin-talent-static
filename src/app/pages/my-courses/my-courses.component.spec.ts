import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWebinarListComponent } from './my-courses.component';

describe('MyCoursesComponent', () => {
  let component: MyWebinarListComponent;
  let fixture: ComponentFixture<MyWebinarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyWebinarListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyWebinarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
