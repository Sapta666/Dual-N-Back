import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DualNBackComponent } from './dual-n-back/dual-n-back.component';
import { NBackSettingsPopupComponent } from './dual-n-back/settings-popup/n-back-settings-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogsModule } from '@progress/kendo-angular-dialog';




@NgModule({
  declarations: [
    AppComponent,

    DualNBackComponent,
    NBackSettingsPopupComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    BrowserAnimationsModule,
    DialogsModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
