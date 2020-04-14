<?php
    class Singleton
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

        public function doSomething($param1, $param2, $param3)
        {
            //do something

            return $this->setResults(true, "Did something");
        }
    }
?>