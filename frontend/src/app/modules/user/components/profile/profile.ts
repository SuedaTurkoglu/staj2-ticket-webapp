import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../service/user.service';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {StyleClass} from 'primeng/styleclass';
import {AuthService} from '../../service/auth.service';
import {UserResponseModel} from '../../model/user-response.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Card, ReactiveFormsModule, InputText, ButtonDirective, DividerModule, StyleClass],
  template: `
    <div class="profile-page">
      <div class="profile-card-wrap">

        <div class="profile-avatar">
          {{ initials() }}
        </div>

        <p-card pStyleClass="profile-card">

          @if (loading()) {
            <div class="profile-loading">
              <span>Loading your profile...</span>
            </div>
          } @else {

            <div class="profile-head">
              <h1 class="profile-title">{{ user?.name }} {{ user?.surname }}</h1>
              <p class="profile-subtitle">{{ user?.mail }}</p>

              @if (user?.admin || user?.driver) {
                <div class="profile-roles">
                  @if (user?.admin) {
                    <span class="profile-role-badge role-admin">Admin</span>
                  }
                  @if (user?.driver) {
                    <span class="profile-role-badge role-driver">Driver</span>
                  }
                </div>
              }
            </div>

            <p-divider></p-divider>

            <form [formGroup]="infoForm" (ngSubmit)="onSaveInfo()" class="profile-form">
              <span class="profile-section-label">Account details</span>

              <div class="profile-row">
                <div class="flex flex-col gap-2 profile-field">
                  <label class="app-form-label" style="margin-bottom: 1rem">Name</label>
                  <input pInputText formControlName="name" />
                  @if (infoForm.controls.name.invalid && (infoForm.controls.name.dirty || infoForm.controls.name.touched)) {
                    <p class="form-invalid">Name must be at least 3 characters</p>
                  }
                </div>

                <div class="flex flex-col gap-2 profile-field">
                  <label class="app-form-label" style="margin-bottom: 1rem">Surname</label>
                  <input pInputText formControlName="surname" />
                  @if (infoForm.controls.surname.invalid && (infoForm.controls.surname.dirty || infoForm.controls.surname.touched)) {
                    <p class="form-invalid">Surname must be at least 3 characters</p>
                  }
                </div>
              </div>

              <button
                pButton
                type="submit"
                class="p-button-brand profile-submit"
                [disabled]="infoForm.invalid || infoForm.pristine || savingInfo()"
              >{{ savingInfo() ? 'Saving...' : 'Save Changes' }}</button>
            </form>

            <p-divider></p-divider>

            <div class="profile-password-toggle">
              <span class="profile-section-label">Password</span>
              <button
                pButton
                type="button"
                class="profile-toggle-btn"
                (click)="showPasswordPanel = !showPasswordPanel"
              >{{ showPasswordPanel ? '▲ Cancel' : '▼ Change Password' }}</button>
            </div>

            <div class="profile-password-panel" [class.expanded]="showPasswordPanel">
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="profile-form">

                <div class="flex flex-col gap-2">
                  <label class="app-form-label" style="margin-bottom: 1rem">Current Password</label>
                  <input pInputText type="password" formControlName="currentPassword" />
                  @if (passwordForm.controls.currentPassword.invalid && (passwordForm.controls.currentPassword.dirty || passwordForm.controls.currentPassword.touched)) {
                    <p class="form-invalid">Enter your current password</p>
                  }
                </div>

                <div class="profile-row">
                  <div class="flex flex-col gap-2 profile-field">
                    <label class="app-form-label" style="margin-bottom: 1rem">New Password</label>
                    <input pInputText type="password" formControlName="newPassword" />
                    @if (passwordForm.controls.newPassword.invalid && (passwordForm.controls.newPassword.dirty || passwordForm.controls.newPassword.touched)) {
                      <p class="form-invalid">Password must be at least 8 characters</p>
                    }
                  </div>

                  <div class="flex flex-col gap-2 profile-field">
                    <label class="app-form-label" style="margin-bottom: 1rem">Confirm Password</label>
                    <input pInputText type="password" formControlName="confirmPassword" />
                    @if (passwordForm.hasError('passwordMismatch') && (passwordForm.controls.confirmPassword.dirty || passwordForm.controls.confirmPassword.touched)) {
                      <p class="form-invalid">Passwords do not match</p>
                    }
                  </div>
                </div>

                <button
                  pButton
                  type="submit"
                  class="p-button-brand profile-submit"
                  [disabled]="passwordForm.invalid || savingPassword()"
                >{{ savingPassword() ? 'Updating...' : 'Update Password' }}</button>
              </form>
            </div>

          }
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem 1rem;
    }

    .profile-card-wrap {
      position: relative;
      width: 100%;
      max-width: 480px;
      animation: profileFadeUp 0.5s ease both;
    }

    .profile-avatar {
      position: absolute;
      top: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(155deg, var(--p-blue-500) 15%, var(--p-primary-400) 85%);
      box-shadow: 0 6px 14px -4px rgba(30, 34, 170, 0.45);
      color: #ffffff;
      font-family: var(--p-font-family, 'Segoe UI');
      font-weight: 600;
      font-size: 1.2rem;
      letter-spacing: 0.5px;
      z-index: 2;
    }

    :host ::ng-deep .profile-card {
      border-radius: 14px;
      padding-top: 2.25rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 24px -10px rgba(30, 34, 170, 0.25);
    }

    :host ::ng-deep .profile-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--p-blue-500, #1e22aa) 0%, var(--p-primary-500, #f76902) 100%);
    }

    .profile-loading {
      text-align: center;
      padding: 2rem 0;
      color: var(--p-surface-500, #6b7280);
      font-size: 0.9rem;
    }

    .profile-head {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .profile-title {
      margin: 0.75rem 0 0rem;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--p-surface-900, #111827);
    }

    .profile-subtitle {
      margin: 0;
      font-size: 1rem;
      color: var(--p-surface-600, #6b7280);
    }

    .profile-roles {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .profile-role-badge {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
    }

    .role-admin {
      background: var(--p-primary-50, #fff0e6);
      color: var(--p-primary-600, #e05e02);
    }

    .role-driver {
      background: var(--p-blue-50, #e8e9fb);
      color: var(--p-blue-600, #171a88);
    }

    .profile-section-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--p-surface-400, #9ca3af);
      margin-bottom: 0rem;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
    }

    .profile-form input {
      width: 100%;
    }

    .profile-row {
      display: flex;
      gap: 1rem;
    }

    .profile-field {
      flex: 1;
      min-width: 0;
    }

    .profile-submit {
      width: 100%;
      justify-content: center;
      margin-bottom: 0 !important;
      margin-top: 0.125rem;
    }

    .form-invalid {
      margin: 0.25rem 0 0;
      font-size: 0.75rem;
      color: #ef4444;
    }

    .profile-password-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .profile-password-toggle .profile-section-label {
      margin-bottom: 0;
    }

    .profile-toggle-btn {
      font-size: 0.75rem;
      padding: 0.4rem 0.75rem;
    }

    .profile-password-panel {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, opacity 0.3s ease;
    }

    .profile-password-panel.expanded {
      max-height: 420px;
      opacity: 1;
      margin-top: 1rem;
    }

    @keyframes profileFadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .profile-row { flex-direction: column; }
    }

    @media (prefers-reduced-motion: reduce) {
      .profile-password-panel { transition: none; }
    }
  `]
})

export class Profile implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private notification = inject(NotificationService);

  user: UserResponseModel | undefined = undefined;
  loading = signal(true);
  savingInfo = signal(false);
  savingPassword = signal(false);
  showPasswordPanel = false;

  infoForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    surname: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: this.passwordMatchValidator() });

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({next: data => {
      this.user = data;
        this.infoForm.patchValue({
          name: this.user.name,
          surname: this.user.surname,
        });
    }});

    this.loading.set(false);
  }

  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPassword = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return newPassword && confirmPassword && newPassword !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

  initials(): string {
    const first = this.user?.name?.charAt(0) ?? '';
    const last = this.user?.surname?.charAt(0) ?? '';
    return (first + last).toUpperCase() || '..?';
  }

  onSaveInfo(): void {
    if (this.infoForm.invalid || !this.user?.userId) return;

    this.savingInfo.set(true);

    console.log(this.infoForm.value as any as UserResponseModel);
    this.userService.updateUserFromProfile(this.infoForm.value as any as UserResponseModel).subscribe({
      next: (data: UserResponseModel) => {
        this.user = data;
        this.infoForm.markAsPristine();
        this.savingInfo.set(false);
        this.notification.showSuccess('Success', 'Your profile has been updated');
      },
      error: (err: HttpErrorResponse) => {
        this.savingInfo.set(false);
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating your profile');
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid || !this.user) return;

    this.savingPassword.set(true);

    // NOTE: swap for the real change-password endpoint once available
    // (e.g. UserService.changePassword(id, value)).

    // this.userService.changePassword(this.user.id, {
    //   currentPassword: this.passwordForm.value.currentPassword,
    //   newPassword: this.passwordForm.value.newPassword,
    // }).subscribe({
    //   next: () => {
    //     this.savingPassword.set(false);
    //     this.passwordForm.reset();
    //     this.showPasswordPanel = false;
    //     this.notification.showSuccess('Success', 'Your password has been updated');
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.savingPassword.set(false);
    //     this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating your password');
    //   }
    // });
  }
}
