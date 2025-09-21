import { TestBed } from '@angular/core/testing';

import { UserImages } from './user-images';

describe('UserImages', () => {
  let service: UserImages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserImages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
