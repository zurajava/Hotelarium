import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryService } from './category.service';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


@NgModule({
  imports: [CommonModule, CategoryRoutingModule, BrowserModule, BrowserAnimationsModule, GridModule, DropDownsModule],
  declarations: [CategoryComponent],
  providers: [CategoryService]
})
export class CategoryModule {

}
