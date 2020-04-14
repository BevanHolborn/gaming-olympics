<?php
    class Actions
    {
        static $RESTRICTED = array
        (

        );

        static $UNRESTRICTED = array
        (
            "getScores" => ["class" => "OlympicsHandler", "file" => "olympics-handler.php"],
            "getGames" => ["class" => "OlympicsHandler", "file" => "olympics-handler.php"],
            "getPlayers" => ["class" => "OlympicsHandler", "file" => "olympics-handler.php"],
            "addMatch" => ["class" => "OlympicsHandler", "file" => "olympics-handler.php"],
        );
    }
?>