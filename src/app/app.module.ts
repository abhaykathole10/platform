import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TaggerComponent } from './tagger/tagger.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { EventsComponent } from './events/events.component';
import { SafePipe } from './pipes/safe.pipe';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TaggerComponent,
    ToolbarComponent,
    EventsComponent,
    SafePipe,
    TestComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
