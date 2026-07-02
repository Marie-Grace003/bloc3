<?php

namespace App\Console\Commands;

use App\Models\Room;
use App\Models\Film;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PrepareLoadTestData extends Command
{
    protected $signature = "load-test:prepare {--users=50} {--seats=20}";
    protected $description = "Crée une séance à places limitées + des utilisateurs avec tokens Sanctum pour le test de charge k6";

    public function handle(): int
    {
        $userCount = (int) $this->option("users");
        $seats     = (int) $this->option("seats");

        $film = Film::factory()->create(["status" => "showing"]);
        $room = Room::factory()->create();

        $screening = Screening::factory()->create([
            "id_film"         => $film->id_film,
            "id_room"         => $room->id_room,
            "date"            => now()->addDays(2)->format("Y-m-d"),
            "time"            => "20:00:00",
            "seats_remaining" => $seats,
        ]);

        $tokens = [];
        for ($i = 0; $i < $userCount; $i++) {
            $user = User::factory()->create();
            $tokens[] = $user->createToken("load-test")->plainTextToken;
        }

        $payload = [
            "screening_id"    => $screening->id_screening,
            "seats_available" => $seats,
            "tokens"          => $tokens,
        ];

        File::put(
            storage_path("app/load-test-data.json"),
            json_encode($payload, JSON_PRETTY_PRINT)
        );

        $this->info("Prêt : séance #{$screening->id_screening} avec {$seats} places, {$userCount} tokens générés.");
        $this->info("Fichier : storage/app/load-test-data.json");

        return self::SUCCESS;
    }
}
