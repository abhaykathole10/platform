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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TaggerComponent,
    ToolbarComponent,
    EventsComponent,
    SafePipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}