import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface User {
  login: string;
  avatar_url: string;
  location: string;
  bio: string;
  public_repos: number;
  html_url: any;
  twitter_username?: string;
}

export interface Repository {
  name: string;
  description: string;
  html_url: string;
  languages_url: string;
  languages: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.github.com';
  
  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<User | null> {
    const url = `${this.apiUrl}/users/${username}`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null); 
        }
        throw error; 
      })
    );
  }

  getRepositories(username: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = {
      page: page.toString(),
      per_page: pageSize.toString()
    };
    return this.http.get(`${this.apiUrl}/users/${username}/repos`, { params });
  }

  getUserRepos(username: string): Observable<Repository[]> {
    const url = `${this.apiUrl}/users/${username}/repos`;
    return this.http.get<Repository[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching user repositories:', error);
        return [];
      })
    );
  }

  getAllLanguagesForUserRepos(username: string): Observable<Repository[]> {
    return this.getUserRepos(username).pipe(
      switchMap(repos => {
        const observables: Observable<any>[] = [];
        for (const repo of repos) {
          observables.push(
            this.http.get<any>(repo.languages_url).pipe(
              map(languages => ({
                ...repo,
                languages: Object.keys(languages) // Extract languages as an array of strings
              }))
            )
          );
        }
        return forkJoin(observables);
      }),
      catchError(error => {
        console.error('Error fetching languages for user repositories:', error);
        return [];
      })
    );
  }
  
}
