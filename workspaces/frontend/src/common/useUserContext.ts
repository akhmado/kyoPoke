import { Dispatch, SetStateAction, createContext } from "react";
import { IUser } from "./types";
export const UserContext = createContext<
  [IUser | null, Dispatch<SetStateAction<IUser | null>> | null]
>([null, null]);
