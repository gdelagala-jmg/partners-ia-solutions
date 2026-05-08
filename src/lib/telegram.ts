/**
 * Utility to send notifications via Telegram Bot API
 */
export async function sendTelegramNotification(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || chatId === "PON_AQUI_TU_ID_DE_PASO_2") {
        console.warn("Telegram notification skipped: Token or Chat ID not configured properly.");
        return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API error:', errorData);
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}
