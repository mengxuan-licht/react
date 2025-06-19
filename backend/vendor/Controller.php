<?php
namespace Vendor;
abstract class Controller {
    protected static function response($status, $message, $result = null) {
        $resp['status'] = $status;
        $resp['message'] = $message;
        $resp['result'] = $result;
        return $resp;
    }
}
?>
