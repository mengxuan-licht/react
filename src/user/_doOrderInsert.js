import Request from '../shared/Request.js';
import loginPage from '../pages/LoginPage.jsx';
import _doOrderInsert from './_doOrderInsert.js';

export default function doOrderInsert(formData, onSuccess) {
  Request().get("/index.php?action=getProfile")
    .then(res => {
      const r = res.data;
      if (r.status === 200) {
        localStorage.setItem("username", r.name);
        localStorage.setItem("role", r.role);
        _doOrderInsert(formData, onSuccess);
      } else {
        loginPage();
      }
    })
    .catch(err => {
      console.warn("無法驗證身份", err);
      loginPage();
    });
}
