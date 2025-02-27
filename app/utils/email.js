import nodemailer from 'nodemailer'

export async function sendRecoveryEmail(email, resetUrl) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  await transporter.sendMail({
    from: '"Rebuild App" <rebuild2025xx@gmail.com>',
    to: email,
    subject: 'Recuperación de Contraseña - Rebuild',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="https://i.imgur.com/yZ3DMsM.png" 
             alt="Rebuild Logo" 
             style="width: 64px; height: 64px; margin-bottom: 20px;">
        
        <h1 style="color: #FFA500; margin-bottom: 20px;">Recuperación de Contraseña</h1>
        
        <p style="color: #666; line-height: 1.5; margin-bottom: 15px;">
          Hola,
        </p>
        
        <p style="color: #666; line-height: 1.5; margin-bottom: 15px;">
          Has solicitado restablecer tu contraseña en Rebuild. Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #FFA500; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    font-weight: bold;">
            Restablecer Contraseña
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.5; margin-bottom: 15px;">
          Este enlace expirará en 1 hora por razones de seguridad.
        </p>
        
        <p style="color: #666; line-height: 1.5; margin-bottom: 15px;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. Tu cuenta está segura.
        </p>
        
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
          <p style="color: #999; font-size: 12px;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </div>
      </div>
    `
  })
} 