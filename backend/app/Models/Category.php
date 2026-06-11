<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $primaryKey = 'id_category';

    protected $fillable = [
        'name',
    ];

    public function films()
    {
        return $this->hasMany(Film::class, 'id_category', 'id_category');
    }
}
