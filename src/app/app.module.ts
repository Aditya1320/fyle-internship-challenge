import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from './services/api.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    NgxSkeletonLoaderModule
  ],
  providers: [ 
    MatPaginatorIntl,
    ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
