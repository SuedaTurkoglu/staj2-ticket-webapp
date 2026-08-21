import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UserModel} from '../model/user.model';
import {JsonConvert} from 'json2typescript';
import {BehaviorSubject, tap} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from '../../../shared/notification/notification.service';
import {UserResponseModel} from '../model/user-response.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  router = inject(Router);
  private notification = inject(NotificationService);

  private loggedIn = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject = new BehaviorSubject<UserResponseModel | null>(null);

  get isLoggedIn$() { return this.loggedIn.asObservable(); } // for signals etc
  get isLoggedIn(): boolean { return this.loggedIn.value; } //for guards
  get loggedInUser$() { return this.loggedInUserSubject.asObservable(); }

  get userModel(): UserResponseModel | null { return this.loggedInUserSubject.value; }

  private authReady = new BehaviorSubject<boolean>(false); //to cancel the race condition
  get authReady$() { return this.authReady.asObservable(); }

  constructor() {
    // re check if page reloads - route changes
    if (localStorage.getItem('token')) {
      this.loggedIn.next(true);
      this.getCurrentUser().subscribe({
        complete: () => this.authReady.next(true)
      });
    } else this.authReady.next(true);
  }

  loginUser(user: UserModel){
    return this.http.post<any>(`/user/login`, new JsonConvert().serialize(user, UserModel), {responseType: 'text'})
      .subscribe({ next: (response: string) => { // receives token
          localStorage.setItem("token", response); //first set to browser and then call the current user endpoint!
          this.loggedIn.next(true);
          this.getCurrentUser().subscribe();
          this.router.navigate(["/"]);

          this.notification.showSuccess('Welcome back', 'You have been logged in');
      }, error: (err) => {
        this.loggedIn.next(false);
        this.router.navigate(["/log-in"]);

        this.notification.showHttpError(err, err.error?.message ?? 'Invalid email or password');
      }}
    );
  }

  logoutUser() {
    this.loggedIn.next(false);
    this.loggedInUserSubject.next(null);
    localStorage.removeItem("token");
    this.router.navigate(["/log-in"]);
  }

  getCurrentUser() {
    return this.http.get<UserResponseModel>(`/user/current-user`).pipe(
      tap({ ///
      next: (userResponse) => {
        this.loggedInUserSubject.next(userResponse); //aka mail

        // this.notification.showSuccess('Hello again', 'You have been authorized');
      }, error: (err: HttpErrorResponse) => {
        this.logoutUser();
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading your profile. You seem to be logged out. Please log in again');
      }
    }));
  }

  isAdmin(): boolean {
    return this.userModel?.admin!;
  }

  isDriver(): boolean {
    return this.userModel?.driver!;
  }



}
