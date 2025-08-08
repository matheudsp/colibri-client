import { userRole } from "../constants/userRole";

type UserRole = (typeof userRole)[number]["value"];

export interface userProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: boolean;
}
