import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, Repository, User } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ 
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        NgxSkeletonLoaderModule
      ],
      providers: [ApiService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'fyle-frontend-challenge'`, () => {
    expect(component.title).toEqual('fyle-frontend-challenge');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('title')?.textContent).toContain('fyle-frontend-challenge');
  });

  it('should initialize with empty username and loading state', () => {
    expect(component.username).toBe('');
    expect(component.loading).toBeFalse();
  });

  it('should search user and load user data and repositories', () => {
    const userData: User = {
      login: 'testuser',
      avatar_url: 'avatar-url',
      location: 'test location',
      bio: 'test bio',
      public_repos: 5,
      html_url: 'html-url',
      twitter_username: 'testuser_twitter',
    };
    const repoData: Repository[] = [
      { name: 'repo1', description: 'repo1 description', html_url: 'repo1-url', languages_url: 'languages_url1', languages: ['JavaScript', 'TypeScript'] },
      { name: 'repo2', description: 'repo2 description', html_url: 'repo2-url', languages_url: 'languages_url2', languages: ['HTML', 'CSS'] }
    ];
    spyOn(apiService, 'getUser').and.returnValue(of(userData));
    spyOn(apiService, 'getAllLanguagesForUserRepos').and.returnValue(of(repoData));
    component.username = 'testuser';
    component.searchUser();
    expect(apiService.getUser).toHaveBeenCalledOnceWith('testuser');
    expect(apiService.getAllLanguagesForUserRepos).toHaveBeenCalledOnceWith('testuser');
    expect(component.user).toEqual(userData);
    expect(component.repositories).toEqual(repoData);
  });

});
