import { DictionaryRouting } from './dictionary-routing.module';
import { DictionaryComponent } from './dictionary.component';
import { DictionaryService } from './dictionary.service';



import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';


@NgModule({
    imports:[SharedModule,DictionaryRouting],
    declarations:[DictionaryComponent],
    providers:[DictionaryService]
})

export class DictionaryModule {

}