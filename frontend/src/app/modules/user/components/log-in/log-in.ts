import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {RouterLink} from '@angular/router';
import { SignIn } from '@primeicons/angular/sign-in';
import {UserModel} from '../../model/user.model';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [Card, ReactiveFormsModule, InputText, ButtonDirective, ClassNames, RouterLink, SignIn],
  template: `
    <div class="auth-page">
      <div class="auth-card-wrap">

        <div class="auth-badge">
          <svg data-p-icon="sign-in" color="#ffffff"/>
        </div>

        <p-card pClass="auth-card">
          <div class="auth-card-head">
            <h1 class="auth-title">Welcome back</h1>
            <p class="auth-subtitle">Log in to manage your trips and tickets</p>
          </div>

          <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="auth-form">

            <div class="flex flex-col gap-2">
              <label class="app-form-label" style="margin-bottom: 1rem">Mail</label>
              <input pInputText placeholder="ex@example.com" formControlName="mail" />
              @if (formGroup.controls.mail.invalid && (formGroup.controls.mail.dirty || formGroup.controls.mail.touched)) {
                <p class="form-invalid">Enter in mail format</p>
              }
            </div>

            <div class="flex flex-col gap-2">
              <label class="app-form-label" style="margin-bottom: 1rem">Password</label>
              <input pInputText type="password" placeholder="" formControlName="password" />
              @if (formGroup.controls.password.invalid && (formGroup.controls.password.dirty || formGroup.controls.password.touched)) {
                <p class="form-invalid">Enter your password</p>
              }
            </div>

            <button pButton class="p-button-brand auth-submit" type="submit" [disabled]="formGroup.invalid || loading">
              Log In
            </button>

            <p class="auth-switch">
              Don't have an account? <a routerLink="/sign-up">Sign up</a>
            </p>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class LogIn {
  authService = inject(AuthService);
  loading = false;

  formGroup = new FormGroup({
    mail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl(''),
    surname: new FormControl('')
  });

  onSubmit() {
    this.loading = true;

    this.authService.loginUser(<UserModel>this.formGroup.value);

    this.loading = false;
  }
}
