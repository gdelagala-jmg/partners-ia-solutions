/**
 * Utility to send notifications via Telegram Bot API
 */

export function escapeHTML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export async function sendTelegramNotification(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || chatId === "PON_AQUI_TU_ID_DE_PASO_2") {
        console.warn("Telegram notification skipped: Token or Chat ID not configured properly.", {
            hasToken: !!token,
            hasChatId: !!chatId,
            isPlaceholder: chatId === "PON_AQUI_TU_ID_DE_PASO_2"
        });
        return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        // Note: The message itself might contain intentional HTML tags like <b> or <i>
        // We only escape the variables that go inside it if we were building it here,
        // but since the message is passed as a whole, we assume the caller handled it
        // or we provide a more robust way. 
        // For now, let's at least log if it fails.

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
            
            // Fallback: try sending as plain text if HTML fails
            if (errorData.description?.includes('can\'t parse entities')) {
                console.info('Retrying Telegram notification as plain text...');
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message.replace(/<[^>]*>?/gm, ''), // Strip tags
                    }),
                });
            }
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}

