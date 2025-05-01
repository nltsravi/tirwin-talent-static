import { NgModule } from '@angular/core';
import { DefaultLayoutComponent } from './default-layout.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components';
import { FooterComponent } from '../../components/footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DefaultLayoutComponent,
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        DefaultLayoutComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class DefaultLayoutModule {
}
