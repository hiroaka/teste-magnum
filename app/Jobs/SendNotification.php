<?php

namespace App\Jobs;

use App\Models\Message;
use App\Models\PushToken;
use App\Models\User;
use ExpoSDK\Expo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use ExpoSDK\ExpoMessage;
use Illuminate\Support\Facades\Log;


class SendNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    var $message;
    var $notification;
    var $api;

    /**
     * Create a new job instance.
     */
    public function __construct(Message $message)
    {

        $this->message = $message;


    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $message = (new ExpoMessage([
            'title' => $this->message->title,
            'body' => $this->message->content,
        ]))
//            ->setTitle('This title overrides initial title')
//            ->setBody('This notification body overrides initial body')
            ->setData([
                'message_id' => $this->message->id,
                'url' => $this->message->url
            ])
            ->setChannelId('default')
            ->setBadge(0)
            ->setSound('alert')
            ->playSound();

        $recipients = [];
        //taraget user?
        if ($this->message->target == 'user') {
            $pushIds = $this->message->users()->where('push_id', 'LIKE', 'ExponentPushToken%')
                ->pluck('push_id')->map(function ($item) use ($recipients) {
                    if (!$item || !strstr($item, 'ExponentPushToken')) {
                    } else {
//                        array_push($recipients, $item);
                        return $item;
                    }
                })->toArray();
//        dd($this->message->users->first()->id);
            $pushTokens = PushToken::select('token')
                ->where('user_id', $this->message->users->first()->id)
                ->where('token', 'LIKE', 'ExponentPushToken%')->get()->pluck('token')->map(function ($item) use ($recipients) {
//                    dd($item);
                    if (!$item || !strstr($item, 'ExponentPushToken')) {
                        return false;
                    }
                    return $item;
//                    array_push($recipients, 'iu');
                })->toArray();


            $recipients = array_unique(array_merge($pushIds, $pushTokens));
            Log::info('recipients for user', ['$pushIds' => $pushIds, '$pushTokens' => $pushTokens]);

        } else {
            $recipients = PushToken::select('token')->where('token', 'LIKE', 'ExponentPushToken%')->get()->pluck('token')->map(function ($item) {
                if (!$item || !strstr($item, 'ExponentPushToken')) {
                    return false;
                }
                return $item;
            })->toArray();
            Log::info('recipients for all', ['$pushIds' => $recipients ]);
        }

        if (!count($recipients)) {
            Log::info('No recipients found', ['message' => $this->message->title]);
            return;
        }
//        dd($recipients);
        $expo = new Expo();

        $response = $expo->send($message)->to($recipients)->push();

        $data = $response->getData();

        //dd($data);
        Log::info('Notification sent', ['data' => $data, 'recepients' => $recipients, 'message' => $this->message->title]);
    }
}
