import { NgModule } from '@angular/core';
import { DefaultLayoutComponent } from './default-layout.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DefaultLayoutComponent,
        HeaderComponent
    ],
    exports: [
        DefaultLayoutComponent,
        HeaderComponent
    ]
})
export class DefaultLayoutModule {
}
