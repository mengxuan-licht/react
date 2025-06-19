// src/admin/doDelete.js
import Request from '../shared/Request.js';
import qs from 'qs';

export default function doDelete(id) {
  if (!id) return Promise.reject(new Error('缺少 id'));

  const data = { id };
  return Request()
    .post('/index.php?action=removeOrder', qs.stringify(data))
    .then(res => {
      const response = res.data;
      if (response.token && window.localStorage) {
        localStorage.setItem('jwtToken', response.token);
      }
      const status = parseInt(response.status);
      if (status === 200) {
        return response;
      } else if (status === 401) {
        // 未授權，這邊可做跳轉或拋錯
        return Promise.reject(new Error('Token 過期，請重新登入'));
      } else if (status === 403) {
        return Promise.reject(new Error('權限不足'));
      } else {
        return Promise.reject(new Error(response.message || '未知錯誤'));
      }
    });
}
