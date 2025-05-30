import { sendEmail } from '../transporter';

export const resetPassword = async (to: string, url: string): Promise<void> => {
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
          .mdp {
            display:flex;
          }            
          .button {
            margin: 10px auto;
            background-color: #133f63;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          }
          a, a:visited, a:link {
          color: white;
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
          <p>Mail de ré-initialisation de mot de passe</p>
        </div>
        
        <div class="content">
          <h2>Bonjour !</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>

          <div class="mdp">
          <a href="${url}"class="button">Cliquez ici pour réinitialiser le mot de passe</a>
          </div>
          <p>ou copiez collez le lien ci-dessous dans le votre navigateur</p>

          <a href="${url}">${url}</a>

          
          <p>Cordialement,<br>L'équipe DoctoPlan</p>
        </div>
        
        <div class="footer">
          <p>📢 Ce mail est généré automatiquement. Merci de ne pas répondre.</p>
        </div>
      </body>
      </html>
    `;

  const textContent = `
      DOCTOPLAN - Mail de ré-initialisation de mot de passe
      
      Bonjour !
      
      Vous avez demandé la réinitialisation de votre mot de passe
      
      
      Cordialement,
      L'équipe DoctoPlan
      
      ---
      Ce mail est généré automatiquement. Merci de ne pas répondre.
    `;

  await sendEmail({
    to,
    subject: '📧 Réinitialisation de mot de passe utilisateur - DoctoPlan',
    text: textContent,
    html: htmlContent,
  });
};
