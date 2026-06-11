<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $primaryKey = 'id_booking';

    protected $fillable = [
        'seats_count',
        'status',
        'expires_at',
        'id_user',
        'id_screening',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class, 'id_screening', 'id_screening');
    }
}
