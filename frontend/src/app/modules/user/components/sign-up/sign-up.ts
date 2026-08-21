import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
import {UserModel} from '../../model/user.model';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import { User } from '@primeicons/angular/user';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [Card, ReactiveFormsModule, InputText, ButtonDirective, ClassNames, RouterLink, User],
  template: `
    <div class="auth-page">
      <div class="auth-card-wrap">

        <div class="auth-badge">
          <svg data-p-icon="user" color="#ffffff"/>
        </div>

        <p-card pClass="auth-card">
          <div class="auth-card-head">
            <h1 class="auth-title">Create an account</h1>
            <p class="auth-subtitle">Join us to start booking your trips</p>
          </div>

          <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="auth-form">

            <div class="auth-row">
              <div class="flex flex-col gap-2 auth-field">
                <label class="app-form-label" style="margin-bottom: 1rem">Name</label>
                <input pInputText placeholder="" formControlName="name" />
                @if (formGroup.controls.name.invalid && (formGroup.controls.name.dirty || formGroup.controls.name.touched)) {
                  <p class="form-invalid">Name must be at least 3 characters</p>
                }
              </div>

              <div class="flex flex-col gap-2 auth-field">
                <label class="app-form-label" style="margin-bottom: 1rem">Surname</label>
                <input pInputText placeholder="" formControlName="surname" />
                @if (formGroup.controls.surname.invalid && (formGroup.controls.surname.dirty || formGroup.controls.surname.touched)) {
                  <p class="form-invalid">Surname must be at least 3 characters</p>
                }
              </div>
            </div>

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
                <p class="form-invalid">Password must be at least 8 characters</p>
              }
            </div>

            <button pButton class="p-button-brand auth-submit" type="submit" [disabled]="formGroup.invalid">
              Create Account
            </button>

            <p class="auth-switch">
              Already have an account? <a routerLink="/log-in">Log in</a>
            </p>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`

    .auth-row {
      display: flex;
      gap: 1rem;
    }

    .auth-field {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 480px) {
      .auth-row { flex-direction: column; }
    }
  `]
})
export class SignUp {
  userService = inject(UserService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  formGroup = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    surname: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    mail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    admin: new FormControl(false),
    driver: new FormControl(false)
  });

  onSubmit() {
    this.userService.createUser(this.formGroup.value as any as UserModel).subscribe({
      next: (data) => {
        this.router.navigate(['/login']);
        this.notification.showSuccess('Success', `User created`);
      },
      error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating user');
      }
    });
  }
}
