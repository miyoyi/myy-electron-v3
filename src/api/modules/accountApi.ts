import axios from "axios";
import { UserState } from "@/store/modules/user/types";

export interface LoginData {
  username: string;
  password: string;
}

export function login(data: LoginData) {
  // return axios.post<UserState>('/account/admin/login', data);
  return axios.post<UserState>("/user/login", data);
}
export function getMenuList() {
  return axios.post<any>("/account/menu/getPermitMenu", {});
}
