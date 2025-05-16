import { sendEmail } from "../transporter";

export const sendSimpleTestEmail = async (to: string): Promise<void> => {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mail de test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #133f63;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            background-color: #133f63;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DoctoPlan</h1>
          <p>Mail de test</p>
        </div>
        
        <div class="content">
          <h2>Bonjour !</h2>
          <p>Ceci est un mail de test pour vérifier la configuration du serveur email.</p>
          <p>Si vous recevez ce message, cela signifie que :</p>
          <ul>
            <li>✅ Le serveur SMTP est correctement configuré</li>
            <li>✅ Les identifiants d'authentification sont valides</li>
            <li>✅ L'envoi d'emails fonctionne correctement</li>
          </ul>
          
          <a href="#" class="button">Bouton de test</a>
          
          <p>Cordialement,<br>L'équipe DoctoPlan</p>
        </div>
        
        <div class="footer">
          <p>Ceci est un email automatique généré à des fins de test.</p>
        </div>
      </body>
      </html>
    `;

  const textContent = `
      DOCTOPLAN - Mail de test
      
      Bonjour !
      
      Ceci est un mail de test pour vérifier la configuration du serveur email.
      
      Si vous recevez ce message, cela signifie que :
      - Le serveur SMTP est correctement configuré
      - Les identifiants d'authentification sont valides
      - L'envoi d'emails fonctionne correctement
      
      Cordialement,
      L'équipe DoctoPlan
      
      ---
      Ceci est un email automatique généré à des fins de test.
    `;

  await sendEmail({
    to,
    subject: "📧 Test de configuration email - DoctoPlan",
    text: textContent,
    html: htmlContent,
  });
};
