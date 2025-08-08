import { companyType } from "../constants";

export type CompanyType = (typeof companyType)[number]["value"];
