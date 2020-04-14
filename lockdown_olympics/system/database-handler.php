<?php
    class DatabaseHandler
    {
        //static instance variable
        private static $instance = null;
        //member variable
        private $conn = null;

        //instantiate or access already instantiated instance
        public static function getInstance()
        {
            if (!self::$instance) self::$instance = new self();
            return self::$instance;
        }

        //initialize any private/public members the class will use
        private function __construct()
        {
            $this->conn = mysqli_connect("localhost", "experime_bevan", "Tempexperimentpass23", "experime_olympics");
            //$this->conn = mysqli_connect("localhost","root","", "experime_olympics");
        }

        //format result into standard format
        //this ony requires a result, details and data can be omitted
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

        //tests for a successful connection
        private function testConnection()
        {
            if($this->conn && !$this->conn->connect_errno) return true;
            else return false;
        }

        //sanitises database inputs for security //todo does this even work?
        //todo make sure this is used whenever anything is added to the database
        //todo do we have a fullproof way to stop SQL injections


        public function getScores()
        {
            if($this->testConnection())
            {
                $query = "SELECT m.matchID 'matchID', g.name 'game', p.name 'player', s.score 'score'
                          FROM games g, players p, scores s, matches m
                          where s.matchID = m.matchID and s.playerID = p.playerID and m.gameID = g.gameID
                          ORDER BY m.matchID;";

                $result = $this->conn->query($query);
                if($result)
                {
                    $scores = [];

                    while($score = $result->fetch_assoc())
                    {
                        $score = (object)$score;
                        array_push($scores, $score);
                    }

                    return $this->setResults(true, null, $scores);
                }
                else return $this->setResults(false, "error querying database", $this->conn->error);
            }
            else return $this->setResults(false, "couldn't connect to database", $this->conn->error);
        }

        public function getGames()
        {
            if($this->testConnection())
            {
                $query = "SELECT *
                          FROM games;";

                $result = $this->conn->query($query);
                if($result)
                {
                    $games = [];

                    while($game = $result->fetch_assoc())
                    {
                        $game = (object)$game;
                        array_push($games, $game);
                    }

                    return $this->setResults(true, null, $games);
                }
                else return $this->setResults(false, "error querying database", $this->conn->error);
            }
            else return $this->setResults(false, "couldn't connect to database", $this->conn->error);
        }

        public function getPlayers()
        {
            if($this->testConnection())
            {
                $query = "SELECT *
                          FROM players;";

                $result = $this->conn->query($query);
                if($result)
                {
                    $players = [];

                    while($player = $result->fetch_assoc())
                    {
                        $player = (object)$player;
                        array_push($players, $player);
                    }

                    return $this->setResults(true, null, $players);
                }
                else return $this->setResults(false, "error querying database", $this->conn->error);
            }
            else return $this->setResults(false, "couldn't connect to database", $this->conn->error);
        }

        //create match
        public function addMatch($gameID)
        {
            if($this->testConnection())
            {
                $query = "INSERT
                          INTO matches(gameID)
                          VALUES('$gameID');";

                $result = $this->conn->query($query);
                if($result) return $this->setResults(true, null, $this->conn->insert_id);
                else return $this->setResults(false, "error querying database", $this->conn->error);
            }
            else return $this->setResults(false, "couldn't connect to database", $this->conn->error);
        }

        //create score
        public function addScore($matchID, $playerID, $score)
        {
            if($this->testConnection())
            {
                $query = "INSERT
                          INTO scores(matchID, playerID, score)
                          VALUES('$matchID', '$playerID', '$score');";

                $result = $this->conn->query($query);
                if($result) return $this->setResults(true);
                else return $this->setResults(false, "error querying database", $this->conn->error);
            }
            else return $this->setResults(false, "couldn't connect to database", $this->conn->error);
        }

    }
?>