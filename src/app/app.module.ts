import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // ngModel을 쓰기 위함. core에 포함이 안되고 @angular/forms에 포함되어 있음
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
