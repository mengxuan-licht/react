import Qs from 'qs';
import Request from './Request.js';

export default function checkPermission(actionName, callback) {
  const data = Qs.stringify({ action: actionName });

  Request().post("/index.php?action=checkPermission", data)
    .then(res => {
      callback(res.data?.result === true);
    })
    .catch(() => {
      callback(false);
    });
}
