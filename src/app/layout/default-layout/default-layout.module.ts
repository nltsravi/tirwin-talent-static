import { NgModule } from '@angular/core';
import { DefaultLayoutComponent } from './default-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { FooterModule } from '../../components/footer/footer.module';
import { SliderComponent } from '../../components/slider/slider.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HeaderModule,
        FooterModule,
    ],
    declarations: [
        DefaultLayoutComponent,
        SliderComponent
    ],
    exports: [
        DefaultLayoutComponent
    ]
})
export class DefaultLayoutModule {
}
