const PODCAST_SPOTIFY_HTML = `
<div style="margin-top: 40px; margin-bottom: 0; padding: 28px 24px; background: linear-gradient(135deg, #0f1923 0%, #1a1a2e 60%, #0d1117 100%); border-radius: 20px; text-align: center;">
    <div style="margin-bottom: 14px;">
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" width="90" height="auto" alt="Spotify" style="display: inline-block; vertical-align: middle;">
    </div>
    <p style="font-size: 11px; font-weight: 700; color: #1DB954; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.12em;">🎙️ Nuestro Podcast</p>
    <p style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0; line-height: 1.3; letter-spacing: -0.02em;">Escucha el análisis de la noticia</p>
    <p style="font-size: 14px; color: #a0aec0; margin: 0 0 22px 0; line-height: 1.5;">Cada día analizamos las noticias más relevantes de IA en nuestro podcast.</p>
    <a href="https://open.spotify.com/show/2L0NV7YhTyXzUEcP7VAv7H"
       style="display: inline-block; padding: 13px 28px; background-color: #1DB954; color: #000000; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px; letter-spacing: 0.02em;">
        ▶&nbsp;&nbsp;Escuchar en Spotify
    </a>
</div>
`

const SOCIAL_LINKS_HTML = `
<div style="margin-top: 32px; text-align: center; border-top: 1px solid #f2f2f7; padding-top: 28px;">
    <p style="font-size: 12px; font-weight: 700; color: #86868b; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.1em;">Síguenos en redes sociales</p>
    <div style="display: block; margin-bottom: 8px;">
        <a href="https://www.linkedin.com/company/109997641/" style="display: inline-block; margin: 0 8px; text-decoration: none;" title="LinkedIn">
            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="26" height="26" alt="LinkedIn" style="display: block; opacity: 0.65;">
        </a>
        <a href="https://api.whatsapp.com/send?phone=34639023805" style="display: inline-block; margin: 0 8px; text-decoration: none;" title="WhatsApp">
            <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" width="26" height="26" alt="WhatsApp" style="display: block; opacity: 0.65;">
        </a>
        <a href="https://www.facebook.com/pgf.iasolutions" style="display: inline-block; margin: 0 8px; text-decoration: none;" title="Facebook">
            <img src="https://cdn-icons-png.flaticon.com/512/3670/3670032.png" width="26" height="26" alt="Facebook" style="display: block; opacity: 0.65;">
        </a>
        <a href="https://www.instagram.com/pgf.iasolutions/" style="display: inline-block; margin: 0 8px; text-decoration: none;" title="Instagram">
            <img src="https://cdn-icons-png.flaticon.com/512/3955/3955024.png" width="26" height="26" alt="Instagram" style="display: block; opacity: 0.65;">
        </a>
        <a href="https://www.youtube.com/@PGF.IASolutions" style="display: inline-block; margin: 0 8px; text-decoration: none;" title="YouTube">
            <img src="https://cdn-icons-png.flaticon.com/512/3670/3670147.png" width="26" height="26" alt="YouTube" style="display: block; opacity: 0.65;">
        </a>
    </div>
</div>
`

export function generateNewsletterHtml(campaign: any, isTest: boolean = false, subscriberToken: string = 'test-token') {
    const { subject, preheader, introText, heroImage, content, primaryCtaText, primaryCtaUrl, recommendedSolutions } = campaign
    const unsubscribeUrl = `https://partnersiasolutions.com/newsletter/unsubscribe/${subscriberToken}`

    const solutionsHtml = Array.isArray(recommendedSolutions) 
        ? recommendedSolutions
            .filter((s: any) => s.active)
            .map((s: any) => `
                <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px; background-color: #f9fafb;">
                    <h3 style="margin-top: 0; margin-bottom: 8px; color: #111827; font-size: 18px;">${s.title}</h3>
                    <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;">${s.description || ''}</p>
                    <a href="${s.url}" style="color: #2563eb; font-weight: 600; font-size: 14px; text-decoration: none;">Explorar solución &rarr;</a>
                </div>
            `).join('')
        : ''

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1d1d1f; margin: 0; padding: 0; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { padding: 20px 0; border-bottom: 1px solid #f2f2f7; margin-bottom: 30px; text-align: center; }
            .logo { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; color: #000; text-decoration: none; }
            .hero { width: 100%; border-radius: 16px; margin-bottom: 30px; display: block; }
            .title { font-size: 32px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 20px; color: #000; }
            .intro { font-size: 18px; color: #48484a; margin-bottom: 24px; }
            .content { font-size: 16px; color: #1d1d1f; margin-bottom: 30px; }
            .cta-container { margin: 40px 0; text-align: center; }
            .cta-button { display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 600; font-size: 16px; }
            .footer { font-size: 12px; color: #86868b; margin-top: 20px; border-top: 1px solid #f2f2f7; padding-top: 30px; text-align: center; }
            .test-banner { background-color: #fef3c7; color: #92400e; padding: 10px; text-align: center; font-size: 12px; font-weight: bold; border-radius: 8px; margin-bottom: 20px; }
            img { max-width: 100%; height: auto; }
        </style>
    </head>
    <body>
        <div class="container">
            ${isTest ? '<div class="test-banner">⚠️ ESTE ES UN EMAIL DE PRUEBA (TEST)</div>' : ''}
            ${preheader ? `<div style="display:none;max-height:0px;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
            
            <div class="header">
                <a href="https://partnersiasolutions.com" class="logo">PARTNERS IA <span style="color: #86868b;">SOLUTIONS</span></a>
            </div>

            <h1 class="title">${subject}</h1>
            
            ${heroImage ? `<img src="${heroImage}" class="hero" alt="Hero Image">` : ''}
            
            ${introText ? `<div class="intro">${introText}</div>` : ''}
            
            <div class="content">
                ${content || ''}
            </div>
            
            ${primaryCtaUrl && primaryCtaText ? `
                <div class="cta-container">
                    <a href="${primaryCtaUrl}" class="cta-button">${primaryCtaText}</a>
                </div>
            ` : ''}
            
            ${solutionsHtml ? `
                <div style="margin-top: 50px;">
                    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">También puede interesarte</h2>
                    ${solutionsHtml}
                </div>
            ` : ''}

            ${PODCAST_SPOTIFY_HTML}
            ${SOCIAL_LINKS_HTML}
            
            <div class="footer">
                <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Partners IA Solutions. Todos los derechos reservados.</p>
                <p style="margin-bottom: 16px;">Has recibido este email porque estás suscrito a nuestra newsletter editorial.</p>
                <p>
                    <a href="https://partnersiasolutions.com" style="color: #86868b; text-decoration: underline;">Web principal</a> &bull; 
                    <a href="${unsubscribeUrl}" style="color: #86868b; text-decoration: underline;">Darme de baja</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}

export function generateWelcomeEmailHtml(subscriberToken: string) {
    const unsubscribeUrl = `https://partnersiasolutions.com/newsletter/unsubscribe/${subscriberToken}`

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Partners IA Solutions</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1d1d1f; margin: 0; padding: 0; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { padding: 20px 0; border-bottom: 1px solid #f2f2f7; margin-bottom: 30px; text-align: center; }
            .logo { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; color: #000; text-decoration: none; }
            .title { font-size: 32px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 20px; color: #000; }
            .content { font-size: 16px; color: #1d1d1f; margin-bottom: 30px; }
            .cta-container { margin: 40px 0; text-align: center; }
            .cta-button { display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 600; font-size: 16px; }
            .footer { font-size: 12px; color: #86868b; margin-top: 20px; border-top: 1px solid #f2f2f7; padding-top: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://partnersiasolutions.com" class="logo">PARTNERS IA <span style="color: #86868b;">SOLUTIONS</span></a>
            </div>

            <h1 class="title">¡Bienvenido a nuestra comunidad!</h1>
            
            <div class="content">
                <p>Hola,</p>
                <p>Gracias por suscribirte a la newsletter editorial de <strong>Partners IA Solutions</strong>. Estamos encantados de tenerte con nosotros.</p>
                <p>A partir de ahora, recibirás directamente en tu bandeja de entrada:</p>
                <ul>
                    <li>Análisis exclusivos de las últimas tendencias en IA.</li>
                    <li>Casos de éxito y soluciones prácticas para empresas.</li>
                    <li>Novedades sobre herramientas y automatizaciones que están cambiando el mercado.</li>
                </ul>
                <p>Queremos ayudarte a mantenerte a la vanguardia tecnológica de la forma más sencilla posible.</p>
            </div>
            
            <div class="cta-container">
                <a href="https://partnersiasolutions.com/noticias" class="cta-button">Ver últimas noticias</a>
                <div style="margin-top: 12px;">
                    <a href="https://www.partnersiasolutions.com/soluciones" class="cta-button" style="background-color: #f2f2f7; color: #000000 !important;">Nuestras soluciones</a>
                </div>
            </div>

            ${PODCAST_SPOTIFY_HTML}
            ${SOCIAL_LINKS_HTML}
            
            <div class="footer">
                <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Partners IA Solutions. Todos los derechos reservados.</p>
                <p style="margin-bottom: 16px;">Has recibido este email porque acabas de suscribirte a nuestra newsletter.</p>
                <p>
                    <a href="https://partnersiasolutions.com" style="color: #86868b; text-decoration: underline;">Web principal</a> &bull; 
                    <a href="${unsubscribeUrl}" style="color: #86868b; text-decoration: underline;">Darme de baja</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}

