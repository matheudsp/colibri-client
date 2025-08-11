import { guaranteeTypes } from "../constants";

export type GuaranteeTypes = (typeof guaranteeTypes)[number]["value"];
