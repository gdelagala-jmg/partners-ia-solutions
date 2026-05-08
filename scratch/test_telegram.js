import dotenv from 'dotenv';

dotenv.config();

async function testTelegram() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log('Testing Telegram with:');
    console.log('Token:', token?.substring(0, 10) + '...');
    console.log('Chat ID:', chatId);

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const message = `
🚀 <b>¡CONEXIÓN EXITOSA!</b> 🚀
────────────────
Este es un mensaje de prueba de tu sistema <b>Partners IA Solutions</b>.

Si estás viendo esto, significa que ya recibirás notificaciones instantáneas de tus nuevos leads. ✅
────────────────
<i>Enviado el: ${new Date().toLocaleString()}</i>
`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        const data = await response.json();
        if (data.ok) {
            console.log('✅ Mensaje enviado correctamente a Telegram.');
        } else {
            console.error('❌ Error de Telegram:', data);
        }
    } catch (error) {
        console.error('❌ Error al conectar con Telegram:', error);
    }
}

testTelegram();
