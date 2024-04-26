
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fyle-frontend-challenge';
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs$!: Observable<any>;

  repositories: any[] = [];
  user: any;
  username: string = '';
  loading: boolean = false;
  userNotFound: boolean = false;

  gitHubUrl: any;
  getLanguages: any;
  repo: any;

  constructor(
    private apiservice: ApiService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

  }

  searchUser(): void {
    if (this.username.trim() === '') {
      return;
    }
    this.loading = true;
    
    this.apiservice.getUser(this.username).pipe(
      catchError((error) => {
        alert('User not found');
        this.userNotFound = true;
        console.error(error);
        return throwError('User not found');
      })
    ).subscribe(
      (userData) => {
        console.log(userData);

        this.user = userData;

        console.log(this.user);
      },
      (error) => {
        console.error(error);
      },
      () => {
       
      }
    );
    
    this.dataObs$ = this.apiservice.getAllLanguagesForUserRepos(this.username);
    this.dataObs$.subscribe(
      (repos) => {
        this.repositories = repos;
        console.log(this.repositories.length);
        this.setPagination(this.repositories);
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  pageRedirect(url: any) {
    console.log(url);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No data found');
    }
  }

  setPagination(tableData: any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs$ = this.dataSource.connect();
  }
}
