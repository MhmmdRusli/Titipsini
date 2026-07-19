<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otpCode;

    public function __construct(string $otpCode)
    {
        $this->otpCode = $otpCode;
    }

    public function build()
    {
        return $this->subject('Kode Verifikasi Reset Password - Titipsini')
            ->view('emails.otp')
            ->with(['otpCode' => $this->otpCode]);
    }
}