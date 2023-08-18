import axios from "axios";
import { TableData } from "@/api/type";

export interface LoginData {
  username: string;
  password: string;
}

export function getByClassId(params: any) {
  return axios.get<TableData>("/tool/dict/getByClassId", { params });
}
