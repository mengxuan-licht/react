<?php
$router->register('getUsers', 'Customer', 'getUsers');
$router->register('newUser', 'Customer', 'newUser');
$router->register('removeUser', 'Customer', 'removeUser');
$router->register('updateUser', 'Customer', 'updateUser');

$router->register('getOrders', 'Order', 'getOrders');
$router->register('newOrder', 'Order', 'newOrder');
$router->register('removeOrder', 'Order', 'removeOrder');
$router->register('updateOrder', 'Order', 'updateOrder');
$router->register('cancelOrder', 'Order', 'cancelOrder');

$router->register('markAsRead', 'Order', 'markAsRead');
$router->register('confirmOrderSchedule', 'Order', 'updateStartDate');

$router->register('doLogin', 'Middlewares\\AuthMiddleware', 'doLogin');
$router->register('checkPermission', 'Middlewares\\AuthMiddleware', 'checkPermission');

$router->register('registerUser', 'User', 'publicRegister');
$router->register('getProfile', 'User', 'getProfile');
$router->register('getBlacklist', 'User', 'getBlacklist');
$router->register('unblockUser', 'User', 'unblockUser');
