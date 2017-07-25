import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryService } from './category.service';

@NgModule({
  imports: [
    CommonModule, CategoryRoutingModule
  ],
  declarations: [CategoryComponent],
  providers: [CategoryService]
})
export class CategoryModule {

}
