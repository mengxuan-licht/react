<?php
    namespace Vendor;
    class Router{
        private $routeTable;
        public function __construct(){
            $this->routeTable = array();
        }
        public function register($action, $class, $method){
            $arr['class'] = $class;
            $arr['method'] = $method;
            $this->routeTable[$action] = $arr;
        }
        public function run($action){
            $class = $this->routeTable[$action]['class'];
            $method = $this->routeTable[$action]['method'];
            $class = "Controllers\\" . $class;
            $controller = new $class();
            $response = $controller->$method();
            return $response;
        }
    }
?>