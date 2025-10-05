import { Component, OnInit, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Constants } from '../../shared/constants';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.getFormGroup();
  }

  getFormGroup() {
    return this.fb.group({
      name: ['']
    });
  }

  login() {
    const login = this.form.value;
    let isDm: boolean = true;

    if (login.name.length != 0) {
      sessionStorage.setItem(Constants.LOCAL_STORAGE_KEY_NAME, login.name);
      isDm = false;
    }
    sessionStorage.setItem(Constants.LOCAL_STORAGE_KEY_IS_DM, isDm+'');
  }
}
