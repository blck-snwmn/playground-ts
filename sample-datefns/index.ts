import { TZDate } from "@date-fns/tz";
import { addHours } from "date-fns";

const nowD = new Date();
const nowD2 = addHours(nowD, 1);
console.log(nowD2.toString());

const nowTZ = new TZDate(2024, 12, 1, "Asia/Singapore");
const nowTZ2 = addHours(nowTZ, 1);
console.log(nowTZ2.toString());

const nowTZJst = new TZDate(2024, 12, 1, "JST");
const nowTZJst2 = addHours(nowTZJst, 1);
console.log(nowTZJst2.toString());
