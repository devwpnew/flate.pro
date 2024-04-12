import GET from './get/get'
import SET from './set/set'
import UPDATE from './update/update'
import ADD from './add/add'
import REMOVE from './remove/remove'
import AUTH from "./auth/auth";
import STATS from "./statistics/statistics";
import EMAILS from "./emails/emails"
import IMAGE from "./image"

let API = {};

export default API = {
  get: GET,
  set: SET,
  update: UPDATE,
  add: ADD,
  remove: REMOVE,
  auth: AUTH,
  statistics: STATS,
  sendEmailNotification: EMAILS,
  image: IMAGE
};
