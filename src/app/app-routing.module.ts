import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TaggerComponent } from './tagger/tagger.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { EventsComponent } from './events/events.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'tagger', component: TaggerComponent },
  { path: 'toolbar', component: ToolbarComponent },
  { path: 'events', component: EventsComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
