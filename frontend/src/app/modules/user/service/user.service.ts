import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../model/user.model';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonConvert} from 'json2typescript';
import {UserResponseModel} from '../model/user-response.model';

@Injectable({providedIn: 'root'})
export class UserService {

  private http = inject(HttpClient);

  getListUsers(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<UserResponseModel>>('/user/load', {params: {first: pageFirst, last: pageLast}});
  }

  getUserById(userId: number){
    return this.http.get<UserModel>(`/user/${userId}`);
  }

  createUser(user: UserModel){
    return this.http.post<UserModel>(`/user/signup`, new JsonConvert().serialize(user, UserModel));
  }

  updateUser(userId: number, user: UserResponseModel){
    return this.http.put<UserResponseModel>(`/user/${userId}`, new JsonConvert().serialize(user, UserResponseModel));
  }

  updateUserFromProfile(user: UserResponseModel){
    return this.http.put<UserResponseModel>(`/user/update-my-user`, new JsonConvert().serialize(user, UserResponseModel));
  }

  deleteUser(userId: number){
    return this.http.delete<UserModel>(`/user/${userId}`);
  }

}
