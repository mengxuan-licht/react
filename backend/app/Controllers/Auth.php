<?php
namespace Controllers;

class Auth {
    public function checkPermission() {
        return \Middlewares\AuthMiddleware::checkPermission();
    }
}
