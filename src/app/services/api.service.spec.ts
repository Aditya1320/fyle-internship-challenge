import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService, Repository } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api.github.com'; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: 'API_URL', useValue: apiUrl } 
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    it('should return user data', () => {
      const username = 'testUser';
      const mockUser = {
        login: 'testUser',
        avatar_url: 'https://example.com/avatar',
        location: 'Test Location',
        bio: 'Test Bio',
        public_repos: 10,
        followers: 100,
        following: 50,
        html_url: 'https://github.com/testUser'
      };

      service.getUser(username).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/users/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('getRepositories', () => {
    it('should return repositories', () => {
      const username = 'testUser';
      const mockRepositories: Repository[] = [
        {
          name: 'repo1',
          description: 'Test repository 1',
          html_url: 'https://github.com/testUser/repo1',
          languages_url: 'https://api.github.com/repos/testUser/repo1/languages',
          languages: ['JavaScript', 'TypeScript'] 
        },
        {
          name: 'repo2',
          description: 'Test repository 2',
          html_url: 'https://github.com/testUser/repo2',
          languages_url: 'https://api.github.com/repos/testUser/repo2/languages',
          languages: ['HTML', 'CSS'] 
        }
      ];

      service.getRepositories(username).subscribe(repositories => {
        expect(repositories).toEqual(mockRepositories);
      });

      const req = httpMock.expectOne(`${apiUrl}/users/${username}/repos?page=1&per_page=10`); 
      expect(req.request.method).toBe('GET');
      req.flush(mockRepositories);
    });
  });
});
