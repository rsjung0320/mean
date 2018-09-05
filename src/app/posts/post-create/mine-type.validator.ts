import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mineType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  // fileReader.onloadend = () => {};
  const frObs = Observable.create((pbserver: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener("loadend", () => {

    });
  });
};
