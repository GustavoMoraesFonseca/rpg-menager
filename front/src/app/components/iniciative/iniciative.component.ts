import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../shared/constants';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocketService } from '../../service/socket.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Iniciative } from './model/iniciative';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-iniciative',
  templateUrl: './iniciative.component.html',
  styleUrls: ['./iniciative.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: SocketService,
      useFactory: () => new SocketService('http://localhost:3000')
    }
  ]
})
export class IniciativeComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  private _snackBar = inject(MatSnackBar);

  displayInput!: boolean;
  form!: FormGroup;
  formHp!: FormGroup;
  messages: Iniciative[] = [];
  dataSource = new MatTableDataSource(this.messages);
  displayedColumns: string[] = ['name', 'iniciativeValue', 'hp', 'hpCalc', 'button'];
  isDm: boolean = false;
  charName: string | null = '';

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService<Iniciative>
  ) {
    this.form = this.getFormGroup();
    this.formHp = this.getHpFormGroup();
  }

  ngOnInit(): void {
    this.isDm = sessionStorage.getItem(Constants.LOCAL_STORAGE_KEY_IS_DM) == 'true';
    this.charName = sessionStorage.getItem(Constants.LOCAL_STORAGE_KEY_NAME);

    this.socketService.onInit(
      (data) => this.setIniciatives(data)
    );
    this.socketService.onUpdate((data) => {
      this.setIniciatives(data);
      window.location.reload();
    });
  }
 
  setIniciatives(data: Iniciative[]) {
    this.displayInput = data.find((iniciative) => 
      iniciative.name == this.charName
    ) == undefined;

    this.messages = data;
    this.dataSource = new MatTableDataSource(this.messages);
    this.dataSource.sort = this.sort;
  }

  getFormGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      iniciativeValue: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      hp: ['', [Validators.required, Validators.min(0), Validators.max(2000)]]
    });
  }

  getHpFormGroup() {
    return this.fb.group({
      hpCalc: ['', [Validators.pattern('^[+-]\d+$'), Validators.minLength(2)]],
    });
  }

  send(): void {
    if (!this.isDm) {
      this.form.get('name')?.removeValidators(Validators.required);
      this.form.get('name')?.updateValueAndValidity();
      this.form.value.name = this.charName;
    }
    if (this.form.valid) {
      this.socketService.send(this.form.value);
      this.form = this.getFormGroup();
    } else {
      this._snackBar.open('Colocou Merda', 'Burro!', {duration: 1500});
    }
  }

  sendLife(element: any): void {
    const request: Iniciative = element;
    request.hpCalc = this.formHp.value.hpCalc;
    this.socketService.send(request);
    this.form = this.getFormGroup();
  }

  delete(): void {
    this.socketService.onDelete();
    window.location.reload();
  }
}
