<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f3f4f6; padding: 24px;">
    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; text-align: center;">
        <h2 style="color: #0f766e; margin-bottom: 8px;">Titipsini</h2>
        <p style="color: #374151;">Gunakan kode berikut untuk mereset kata sandi akun kamu:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; margin: 24px 0;">
            {{ $otpCode }}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
            Kode ini berlaku selama 10 menit. Jangan bagikan kode ini ke siapa pun.
        </p>
    </div>
</body>
</html>