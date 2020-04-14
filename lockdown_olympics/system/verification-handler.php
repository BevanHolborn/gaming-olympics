<?php
    class VerificationHandler
    {
        //static instance variable
        private static $instance = null;

        //instantiate or access already instantiated instance
        public static function getInstance()
        {
            if (!self::$instance) self::$instance = new self();
            return self::$instance;
        }

        //initialize any private/public members the class will use
        private function __construct()
        {

        }

        //format result into standard format
        //this ony requires a result. details and data can be omitted
        //if data is added but no details are needed, NULL must be used in place
        private function setResults($result, $details = null, $data = null)
        {
            if(is_object($result)) return $result;
            else
            {
                $results = new stdClass();

                $results->result = $result;

                if($details != null) $results->details = $details;
                else if(isset($results->details)) unset($results->details);

                if($data !== null) $results->data = $data;
                else if(isset($results->data)) unset($results->data);

                return $results;
            }
        }

        //sees if the action for the given action type exists
        private function isAction($action, $type)
        {
            require_once "actions.php";

            if($type == "restricted") return array_key_exists($action, Actions::$RESTRICTED);
            else if($type == "unrestricted") return array_key_exists($action, Actions::$UNRESTRICTED);
            else return false;
        }

        //build the function string for calling and gets the filename for importing
        private function getFunctionCallData($action, $type)
        {
            require_once "actions.php";

            if($type == "restricted") $actionData = Actions::$RESTRICTED[$action];
            if($type == "unrestricted") $actionData = Actions::$UNRESTRICTED[$action];

            $classCall = $actionData["class"] . "::getInstance";
            $functionName = $action;
            $fileName = $actionData["file"];

            return (object)array("classCall" => "$classCall", "functionName" => "$functionName", "file" => $fileName);
        }

        //verifies that the user making the request is the user they say they are and if that user is allowed to make the request (based on login details)
        //if everything is verified. the filename, function name and class that the function belongs to is returned
        public function verify($action, $givenAPIKey)
        {
            //check if the user is logged in and has sent an APIKey
            if(isset($_SESSION["userID"]) && $givenAPIKey !== null)
            {
                //Compare APIKeys to validate user identity
                if($givenAPIKey == $_SESSION["APIKey"])
                {
                    //compare user type (admin vs user)
                    if($_SESSION["admin"] === false)
                    {
                        //validate that user can perform action
                        if($this->isAction($action, "restricted")) return $this->setResults(true, null, $this->getFunctionCallData($action, "restricted"));
                        else return $this->setResults(true, "no valid action found for a user who is logged in", false);
                    }                
                    else return $this->setResults(true, null, $this->getFunctionCallData($action, "restricted"));
                }
                else return $this->setResults(true, "API Keys do not match", false);
            }
            else
            {
                //if user is not logged in
                if(!isset($_SESSION["userID"]))
                {
                    if($this->isAction($action, "unrestricted")) return $this->setResults(true, null, $this->getFunctionCallData($action, "unrestricted"));
                    else return $this->setResults(true, "no valid action found for a user who is not logged in", false);
                }
                else return $this->setResults(true, "you cannot do this while logged in", false);
            }
        }
    }
?>