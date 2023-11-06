<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class DisasterController extends Controller
{
    public function index(Request $request)
    {
        $country = $request->input('country');

        // Make a GET request to the PredictHQ API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer 7fH8QWi8jlZfm66MmU4c06RBf6nHZYDzMR9xVRci',
            'Accept' => 'application/json',
        ])->get('https://api.predicthq.com/v1/events/', [
            'category' => 'disasters',
            'country' => $country
        ]);

        if ($response->successful()) {
            $responseData = $response->json();
            
            // Check if there are any results
            if (!empty($responseData['results'])) {
                // Iterate over each result and extract the desired information
                $disasters = array();
                foreach ($responseData['results'] as $disaster) {
                    $start = new \DateTime($disaster['start']);
                    $end = new \DateTime($disaster['end']);
                    $firstSeen = new \DateTime($disaster['first_seen']);
                
                    $disasters[] = [
                        'title' => $disaster['title'],
                        'description' => $disaster['description'],
                        'start_date' => $start->format('Y-m-d H:i:s'),
                        'end_date' => $end->format('Y-m-d H:i:s'),
                        'first_seen_date' => $firstSeen->format('Y-m-d H:i:s'),
                        'timezone' => $disaster['timezone'],
                        'location' => $disaster['location'],
                        'type' => implode(", ", $disaster['labels'])
                    ];
                }                

                return response()->json($disasters);
            } else {
                return response(404);
            }
        }else return response(404);
    
    }
}

?>
