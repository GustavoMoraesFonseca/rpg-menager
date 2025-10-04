import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '../../service/socket.service';
import { FormBuilder, Validators, FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SkillService } from './service/skill.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '../../shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ClassProperties } from './model/class-properties';


@Component({
  selector: 'app-skill-controller',
  templateUrl: './skill-controller.component.html',
  styleUrls: ['./skill-controller.component.css'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: SocketService,
      useFactory: () => new SocketService('http://localhost:3001')
    }
  ]
})
export class SkillControllerComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  classesName: string[] = [];
  classes: any = {};
  formClass!: FormGroup;

  activeClassName!: string | null;
  activeClassLevel!: string | null;
  isDm: boolean = false;
  activeClass!: any;

  classProperties!: ClassProperties;
  lstClassProperties: ClassProperties[] = [];

  readonly spellSlotsLevels: number[] = [1,2,3,4,5,6,7,8,9];
  readonly classPropertiesEmpty: ClassProperties = {
    class: '', level: '', name: '', spellSlots: {}
  };

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService<ClassProperties>,
    private skillService: SkillService
  ) {
    this.formClass = this.getClassFormGroup();
  }

  ngOnInit() {
    this.isDm = localStorage.getItem(Constants.LOCAL_STORAGE_KEY_IS_DM) == 'true';
    this.activeClassName = localStorage.getItem(Constants.LOCAL_STORAGE_KEY_CLASS);
    this.activeClassLevel = localStorage.getItem(Constants.LOCAL_STORAGE_KEY_LEVEL);

    this.classes = this.skillService.getClasses();
    this.classesName = this.classes.classes.map((obj: any) => obj.classe);
    this.setActiveClass();
    this.setClassProperties();

    if (this.isDm || this.activeClassName != null) {
      this.socketService.onInit(
        (data) => {
          const classProperties = this.getClassPropertiesByCharName(data);
          if (data.length == 0 || classProperties == this.classPropertiesEmpty) {
            this.socketService.send(this.classProperties);
          } else {
            this.classProperties = classProperties;
          }
        }
      );
      this.socketService.onUpdate(
        (data) => this.classProperties = this.getClassPropertiesByCharName(data)
      );
    }
  }

  calcQtdSpellSlot(spellSlotLevel: number, isPlus: boolean) {
    const request: any = this.classProperties;

    var qtdSS = request.spellSlots[spellSlotLevel];

    if(isPlus) {
      qtdSS = qtdSS + 1;

      if (qtdSS > this.activeClass[spellSlotLevel]) {
        this._snackBar.open('O olho que tudo rouba está vendo', 'Burro!', {duration: 1500});
        return;
      }
    } else {
      qtdSS = qtdSS - 1;
    }
    request.qtdSS = qtdSS;
    request.spellSlotLevel = spellSlotLevel;

    this.socketService.send(request);
    window.location.reload();
  }

  getClassPropertiesByCharName(data: any): ClassProperties {
    this.lstClassProperties = data;
    console.log(this.lstClassProperties)

    const classProperties: ClassProperties[] = data.filter(
      (properties: any) => localStorage.getItem(Constants.LOCAL_STORAGE_KEY_NAME) == properties.name
    );

    return classProperties.length == 0? this.classPropertiesEmpty : classProperties[0];
  }

  setActiveClass() {
    if (this.activeClassName && this.activeClassLevel) {
      if (this.activeClassName.includes(',')) {
        const classesName: string[] = this.activeClassName.split(',');
        const classesLevels: string[] = this.activeClassLevel.split(',');

        this.activeClassLevel = classesLevels.reduce(
          (accumulator, currentValue) => accumulator + +currentValue, 0
        )+'';

        const activeClasses: any[] = [];        
        classesName.forEach((className, index) => {
          const i = this.classes.classes.findIndex((clazz: any) => className == clazz.classe);
          const value: number = +classesLevels[index];
          activeClasses.push(this.classes.classes[i].nivels[value - 2].espacosMagia);
        });

        var activeClass: any = {};
        this.spellSlotsLevels.forEach(level => {
          const sum = activeClasses.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue[level]
            }, 0
          );
          activeClass[level] = sum;
        });
        this.activeClass = activeClass;
      } else {
        const i = this.classes.classes.findIndex((clazz: any) => this.activeClassName == clazz.classe);
        const value: number = this.activeClassLevel? +this.activeClassLevel : 0;
        this.activeClass = this.classes.classes[i].nivels[value - 3].espacosMagia;
      }
    }
  }

  setClassProperties() {
    this.classProperties = {  
      name: localStorage.getItem(Constants.LOCAL_STORAGE_KEY_NAME),
      class: this.activeClassName,
      level: this.activeClassLevel,
      spellSlots: this.activeClass,
    };
  }

  getClassFormGroup() {
    return this.fb.group({
      clazz: ['', Validators.required],
      nivel: [0, [Validators.required, Validators.pattern(/^[^a-zA-Z]*$/)]],
    });
  }

  getFormGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    });
  }

  insertClassProperties() {
    try {
      const classProperties = this.formClass.value;
      const commaQtdinClass = classProperties.clazz.length - 1;
      const commaQtdinLevel = classProperties.nivel.split(',').length - 1;
      if (this.formClass.valid && commaQtdinClass == commaQtdinLevel) {
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY_CLASS, classProperties.clazz);
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY_LEVEL, classProperties.nivel);
        window.location.reload();
      } else {
        this._snackBar.open('Colocou Merda', 'Burro!', {duration: 1500});
      }
    } catch (error) {
      this._snackBar.open('Colocou Merda', 'Burro!', {duration: 1500});
    }
  }

  longRest() {
    this.setClassProperties();
    const request: any = this.classProperties;
    request.qtdSS = 0;
    request.spellSlotLevel = 0;

    this.socketService.send(this.classProperties);
    window.location.reload();
  }
}
