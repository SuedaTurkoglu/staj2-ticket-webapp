import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { UserService } from '../../service/user.service';
import { User } from '@primeicons/angular/user';
import { Calendar } from '@primeicons/angular/calendar';
import { Envelope } from '@primeicons/angular/envelope';
import { Inbox } from '@primeicons/angular/inbox';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import { ExclamationTriangle } from '@primeicons/angular/exclamation-triangle';
import { NotificationService } from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CheckboxModule} from 'primeng/checkbox';
import {UserResponseModel} from '../../model/user-response.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-view',
  standalone: true,
  providers: [ConfirmationService],
  imports: [DataViewModule, CardModule, TagModule, DatePipe, ExclamationTriangle, User, Calendar, Envelope, Inbox, FormsModule, InputText, ButtonDirective, ClassNames, ToastModule, ConfirmDialog, CheckboxModule],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Users</span>
        <p class="view-page-subtitle">{{ totalElements }} elements found
          <br>{{ filteredUsers?.length }} user{{ filteredUsers?.length === 1 ? '' : 's' }} shown</p>
      </div>

      <div class="view-search-row">
        <div class="view-search">
          <input
            pInputText
            type="text"
            placeholder="Search by name or mail..."
            [(ngModel)]="searchTerm"
          />
        </div>

        <div class="role-filter-group">
          <button
            pButton
            type="button"
            class="role-filter-btn"
            [class.active]="filterAdmin"
            (click)="toggleAdminFilter()"
          >Admin</button>
          <button
            pButton
            type="button"
            class="role-filter-btn"
            [class.active]="filterDriver"
            (click)="toggleDriverFilter()"
          >Driver</button>
        </div>
      </div>
    </div>

    <p-dataview
      [value]="filteredUsers"
      [paginator]="true"
      [rows]="12"
      [totalRecords]="totalElements"
      [lazy]="true"
      (onLazyLoad)="onPageChange($event)"
      [loading]="loading()"
    >
      <ng-template #list let-items>
        <div class="view-grid" style="position: relative">
          @for (user of items; track user.userId) {
            <p-card pClass="view-card">

              <div class="flex justify-end gap-2 pt-2">
                @if (editingUserId !== user.userId) {
                  <button
                    pButton
                    class="p-button-view-card-edit"
                    type="button"
                    (click)="startEdit(user)"
                    [disabled]="editingUserId !== null"
                  >
                    Edit
                  </button>
                  <button
                    pButton
                    class="p-button-view-card-delete"
                    type="button"
                    (click)="requestDelete($event, user)"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="editingUserId !== null"
                  >
                    Delete
                  </button>
                  <p-confirmdialog id="dialog" [visible]="showConfirm" (onHide)="showConfirm = false">
                    <svg data-p-icon="exclamation-triangle"/>
                  </p-confirmdialog>
                }
              </div>

              <div class="view-card-header">
                <div class="view-avatar-icon">
                  <svg data-p-icon="user"/>
                </div>
                <div>
                  <div class="view-card-title">{{ user.name }} {{ user.surname }}</div>
                  <div class="view-card-date">
                    <svg data-p-icon="calendar"/>
                    Created at: {{ user.createdAt | date: 'mediumDate' }}
                  </div>
                </div>
              </div>

              @if (editingUserId === user.userId) {
                <div class="view-card-body view-card-edit-body">
                  <div class="view-edit-field">
                    <label>Name</label>
                    <input
                      #nameInput="ngModel"
                      pInputText
                      type="text"
                      minlength="3"
                      [(ngModel)]="editedUser.name"
                    />
                  </div>
                  @if (nameInput.invalid && (nameInput.dirty || nameInput.touched)) {
                    <p class=".ng-invalid.ng-touched form-invalid">Name must be at least 3 characters</p>
                  }

                  <div class="view-edit-field">
                    <label>Surname</label>
                    <input
                      #surnameInput="ngModel"
                      pInputText
                      type="text"
                      minlength="3"
                      [(ngModel)]="editedUser.surname"
                    />
                  </div>
                  @if (surnameInput.invalid && (surnameInput.dirty || surnameInput.touched)) {
                    <p class=".ng-invalid.ng-touched form-invalid">Surname must be at least 3 characters</p>
                  }

                  <div class="view-edit-field">
                    <label>Mail</label>
                    <input
                      #mailInput="ngModel"
                      pInputText
                      type="email"
                      [(ngModel)]="editedUser.mail"
                      pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
                    />
                  </div>
                  @if (mailInput.invalid && (mailInput.dirty || mailInput.touched)) {
                    <p class=".ng-invalid.ng-touched form-invalid">Enter in mail format</p>
                  }

                  <div class="view-edit-field-checkbox">
                    <label>Admin</label>
                    <p-checkbox [(ngModel)]="editedUser.admin" [binary]="true" />
                  </div>

                  <div class="view-edit-field-checkbox">
                    <label>Driver</label>
                    <p-checkbox [(ngModel)]="editedUser.driver" [binary]="true" />
                  </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                  <button pButton class="p-button-view-card-cancel" type="button"
                          (click)="cancelEdit()"
                          [disabled]="savingUserId === user.userId"
                  >
                    Cancel
                  </button>
                  <p-toast position="bottom-right" key="bottom-right" />
                  <button pButton class="p-button-view-card-save" type="button"
                          (click)="saveUser(user)"
                          [disabled]="savingUserId === user.userId || nameInput.invalid || nameInput.value === ''
                                        || surnameInput.invalid || surnameInput.value === ''
                                        || mailInput.invalid || mailInput.value === ''"
                  >
                    {{ savingUserId === user.userId ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              } @else {
                <div class="view-card-body">
                  <div class="view-stat">
                    <svg data-p-icon="envelope"/>
                    <span>{{ user.mail }}</span>
                  </div>
                  <div class="view-card-row" style="gap: 1.5rem">
                    @if (user.admin) {
                      <p-tag value="Admin" style="background-color: #ffb9d6 !important" class="view-tag"/>
                    }
                    @if (user.driver) {
                      <p-tag value="Driver" severity="info" class="view-tag"/>
                    }
                  </div>
                </div>
              }
            </p-card>
          }
        </div>
      </ng-template>

      <ng-template #empty>
        <div class="view-empty">
          <svg data-p-icon="inbox"/>
          <p>No users to show yet.</p>
        </div>
      </ng-template>
    </p-dataview>
  `,
  styles: [`
    .view-edit-field-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .view-edit-field-checkbox label {
      margin: 0;
    }

    .view-search-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .role-filter-group {
      display: flex;
      gap: 0.5rem;
    }

    .role-filter-btn {
      background: var(--p-surface-0, #fff);
      border: 1px solid var(--p-surface-200, #e5e7eb);
      color: var(--p-surface-600, #4b5563);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .role-filter-btn:hover {
      border-color: #88748b;
      color: var(--p-primary-50) !important;
      background: #e2b3d5 !important;
    }

    .role-filter-btn.active {
      background: #e2a5c4 !important;
      border-color: #88748b;
      color: #ffffff;
    }

    @media (max-width: 640px) {
      .view-search-row {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class UserView implements OnInit {
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  searchTerm = '';
  totalElements = 0;
  userList?: UserResponseModel[];
  loading = signal(true);

  filterAdmin = false;
  filterDriver = false;

  editingUserId: number | null = null;
  editedUser: Partial<UserResponseModel> = {};
  savingUserId: number | null = null;

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {}

  onPageChange(event: any) {
    this.loadUsers(event.first, event.first + event.rows);
  }

  private loadUsers(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    this.userService.getListUsers(pageFirst, pageLast).subscribe({
      next: (data) => {
        this.userList = data.content;
        this.totalElements = data.totalElements;
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading user list');
        this.loading.set(false);
      }
    });
  }

  toggleAdminFilter(): void {
    this.filterAdmin = !this.filterAdmin;
  }

  toggleDriverFilter(): void {
    this.filterDriver = !this.filterDriver;
  }

  get filteredUsers(): UserResponseModel[] {
    if (!this.userList) { return []; }

    const term = this.searchTerm.trim().toLowerCase();

    return this.userList.filter(user => {
      const matchesTerm = !term ||
        `${user.name} ${user.surname}`.toLowerCase().includes(term) ||
        user.mail.toLowerCase().includes(term);

      const matchesAdmin = !this.filterAdmin || user.admin;
      const matchesDriver = !this.filterDriver || user.driver;

      return matchesTerm && matchesAdmin && matchesDriver;
    });
  }

  requestDelete(event: any, user: UserResponseModel) {
    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'User and all info related to this user will be deleted.<br>Do you want to delete this record?',
      header: 'Confirmation',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },

      accept: () => {
        this.userService.deleteUser(user.userId).subscribe({next: () => {
            this.router.navigate(["/user-view"]);
            this.notification.showSuccess('Success', `User deleted succesfully, please refresh the page`);
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while deleting user');
          }});
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

  startEdit(user: UserResponseModel): void {
    this.editingUserId = user.userId;
    this.editedUser = { ...user };
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editedUser = {};
  }

  saveUser(user: UserResponseModel) {
    if (this.editingUserId !== user.userId) { return; }

    const updatedUser: UserResponseModel = { ...user, ...this.editedUser };
    this.savingUserId = user.userId;

    this.userService.updateUser(user.userId, updatedUser).subscribe({
      next: (result) => {
        const savedUser = result ?? updatedUser;
        this.userList = this.userList?.map(u => u.userId === user.userId ? savedUser : u);
        this.editingUserId = null;
        this.editedUser = {};
        this.savingUserId = null;
        this.router.navigate(["/user-view"]);
        this.notification.showSuccess('Success', `User updated succesfully, please refresh the page`);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating user');
        this.savingUserId = null;
      }
    });
  }
}
