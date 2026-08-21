import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {filter, map, take} from 'rxjs';

export const driverGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.authReady$.pipe(
    filter(ready => ready), //waits until the initial check confirms
    take(1),
    map(() => {
      if (auth.isDriver()) return true;
      router.navigate(['/log-in']);
      return false;
    })
  );
};
