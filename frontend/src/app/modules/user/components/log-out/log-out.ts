import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {Router} from '@angular/router';
import {StyleClass} from 'primeng/styleclass';
import { SignOut } from '@primeicons/angular/sign-out';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [Card, ButtonDirective, StyleClass, SignOut],
  template: `
    <div class="auth-page">
      <div class="auth-card-wrap">

        <div class="auth-badge auth-badge-logout">
          <svg data-p-icon="sign-out" color="#ffffff"/>
        </div>

        <p-card pStyleClass="auth-card">
          <div class="auth-card-head">
            <h1 class="auth-title">Log out</h1>
            <p class="auth-subtitle">Are you sure you want to log out of your account?</p>
          </div>

          <div class="auth-logout-actions">
            <button pButton class="p-button-secondary-blue auth-cancel"
                    [style]="{background: '#ffffff', hoverBackground: '#171a88', color: '#1e22aa'}"
                    type="button"
                    (click)="onCancel()"
                    [disabled]="loading">
              Cancel
            </button>
            <button pButton class="p-button-brand auth-submit" type="button" (click)="onLogout()" [disabled]="loading">
              Log Out
            </button>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`

    .auth-badge-logout {
      background: linear-gradient(135deg, #4b5563 0%, var(--p-primary-500, #f76902) 100%);
    }

    .auth-logout-actions {
      display: flex;
      gap: 0.75rem;
    }

    .auth-cancel,
    .auth-submit {
      flex: 1;
      justify-content: center;
      margin-bottom: 0 !important;
    }
  `]
})
export class LogOut {
  private router = inject(Router);
  private authService = inject(AuthService);
  loading = false;

  onCancel() {
    this.router.navigate(['/']);
  }

  onLogout() {
    this.loading = true;

    this.authService.logoutUser();

    this.loading = false;
  }
}
