import { Injectable } from '@angular/core';
import * as data from '../../../../assets/classes_magias_full.json';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor() { }

  getClasses() {
    return data;
  }
}
