import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  niveauDeLog = 0;

  constructor() { }

  log(nomAssignment:string, action:string) {}

  setNiveauTrace(val:number) {
    this.niveauDeLog = val;
  }
}
