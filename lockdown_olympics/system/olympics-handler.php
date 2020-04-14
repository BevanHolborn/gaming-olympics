<?php
    class OlympicsHandler
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

        public function getScores()
        {
            require_once "database-handler.php";
            $databaseHandler = DatabaseHandler::getInstance();

            $getStandingsResults = $databaseHandler->getScores();
            if($getStandingsResults != null)
            {
                return $this->setResults($getStandingsResults);
            }
            else return $this->setResults($getStandingsResults);
        }

        public function getGames()
        {
            require_once "database-handler.php";
            $databaseHandler = DatabaseHandler::getInstance();

            $getStandingsResults = $databaseHandler->getGames();
            if($getStandingsResults != null)
            {
                return $this->setResults($getStandingsResults);
            }
            else return $this->setResults($getStandingsResults);
        }

        public function getPlayers()
        {
            require_once "database-handler.php";
            $databaseHandler = DatabaseHandler::getInstance();

            $getStandingsResults = $databaseHandler->getPlayers();
            if($getStandingsResults != null)
            {
                return $this->setResults($getStandingsResults);
            }
            else return $this->setResults($getStandingsResults);
        }

        public function addMatch($gameID, $players)
        {
            require_once "database-handler.php";
            $databaseHandler = DatabaseHandler::getInstance();

            //create match
            $matchResults = $databaseHandler->addMatch($gameID);

            if($matchResults->result)
            {
                $matchID = $matchResults->data;

                foreach($players as $player)
                {
                    //add score for each player
                    $scoreResults = $databaseHandler->addScore($matchID, $player->playerID, $player->score);
                }

                return $this->setResults(true);
            }
            else return $this->setResults($matchResults);
        }
    }
?>