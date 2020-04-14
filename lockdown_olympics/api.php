<?php
    error_reporting(E_ALL);
    ini_set("error_reporting", E_ALL);

    session_start();

    /*unset($_SESSION["loggedin"]);
    unset($_SESSION["user"]);
    unset($_SESSION["admin"]);
    session_unset();
    session_destroy();
    exit;*/

    //singleton class
    class APIRequest
    {
        public static $instance;
        public $request;
        public $redirect;

        public static function getInstance()
        {
            if (!self::$instance) self::$instance = new self();
            return self::$instance;
        }

        private function __construct()
        {
            $this->request = null;
            $this->redirect = null;

            $this->formatRequest();
            $this->handleRequest();
        }

        //format result into standard format
        //this ony requires a result, details and data can be omitted
        //if data is added but no details are needed, NULL must be used in place
        private function setResponse($result, $details = null, $data = null)
        {
            header('Content-Type: application/json');

            if(is_object($result)) return $result;
            else
            {
                //create object
                $response = new stdClass();

                //set result
                $response->result = $result;

                //set details
                if($details != null) $response->details = $details;
                else if(isset($response->details)) unset($response->details);

                //set data
                if($data !== null) $response->data = $data;
                else if(isset($response->data)) unset($response->data);

                return $response;
            }
        }

        //format ajax/post/get request
        private function formatRequest()
        {
            if(isset($_POST["action"])) $request = $this->requestArrToObject($_POST);
            else if(isset($_GET["action"])) $request = $this->requestArrToObject($_GET);
            else $request = json_decode(file_get_contents("php://input"));
            $this->request = $request;
        }

        //convert array into object format
        private function requestArrToObject($requestArr)
        {
            $request = new stdClass();

            //get action
            $request->action = $requestArr["action"];

            //get apikey if it exists
            if(isset($arr["APIKey"])) $request->APIKey = $requestArr["APIKey"];

            //store remaining data
            $request->data = $requestArr;
            unset($request->data["action"]);
            unset($request->data["APIKey"]);

            return $request;
        }

        //calls the required function based on requested action
        private function handleRequest()
        {
            //each function will create local variables for the singleton classes it uses. This will allow us to easily see where the function is working
            //this way we don't have to get the instance each time we want to do something
            require_once "system/verification-handler.php";
            $verificationHandler = VerificationHandler::getInstance();

            //this effectively validates that the action can be performed. then returns the file that the function exists in
            //and a string that can be used to call the function

            $verificationResults = $verificationHandler->verify($this->request->action, (isset($this->request->APIKey)) ? $this->request->APIKey : null);
            if($verificationResults->result && $verificationResults->data !== false)
            {
                $fileToLoad = $verificationResults->data->file;
                //load class file
                require_once "system/$fileToLoad";
                //get instance of class
                $handler = call_user_func($verificationResults->data->classCall);

                //call class function with parameters
                if(isset($this->request->data)) $this->respond($this->setResponse($handler->{$verificationResults->data->functionName}(...array_values((array)$this->request->data))));
                else $this->respond($this->setResponse($handler->{$verificationResults->data->functionName}()));
                //Isn't this a fun and easy to read line of code :)
            }
            else $this->respond($this->setResponse(false, $verificationResults->details, $this->request->action));
        }

        private function respond($response)
        {
            echo json_encode($response);
            if($this->redirect != null) header("Location: " . $this->redirect);
        }
    }

    //initialize and start request handling
    $apiRequest = APIRequest::getInstance();
?>