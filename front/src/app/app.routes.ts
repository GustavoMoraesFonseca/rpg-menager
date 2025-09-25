import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IniciativeComponent } from './components/iniciative/iniciative.component';
import { SkillControllerComponent } from './components/skill-controller/skill-controller.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'iniciative', component: IniciativeComponent },
    { path: 'skills', component: SkillControllerComponent },
];
