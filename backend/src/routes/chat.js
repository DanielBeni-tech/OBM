const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// List messages
router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_date ASC',
    [req.userId]
  );
  res.json(result.rows);
});

// Send message and get Oby response
router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message vide' });

  // Save user message
  const userMsg = await pool.query(
    'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3) RETURNING *',
    [req.userId, 'user', content]
  );

  // Generate Oby response
  const obyResponse = await generateObyResponse(content, req.userId);

  // Save assistant message
  const assistantMsg = await pool.query(
    'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3) RETURNING *',
    [req.userId, 'assistant', obyResponse]
  );

  res.json({
    userMessage: userMsg.rows[0],
    assistantMessage: assistantMsg.rows[0]
  });
});

// Clear conversation
router.delete('/', async (req, res) => {
  await pool.query('DELETE FROM chat_messages WHERE user_id = $1', [req.userId]);
  res.json({ ok: true });
});

async function generateObyResponse(message, userId) {
  const lower = message.toLowerCase().trim();

  // Detect sale: amount + sale keywords
  const amountMatch = message.match(/(\d[\d\s]{0,})\s*(?:fcfa|franc|f\b|₣)/i);
  const hasSaleKeyword = /vente|vendre|encaiss|vendu|payé|paye|recette|gagn/i.test(lower);

  if (amountMatch && hasSaleKeyword) {
    const amount = parseInt(amountMatch[1].replace(/\s/g, ''));
    let description = message.replace(amountMatch[0], '').replace(/j['e]?\s*(ai\s+)?(vendu|encaiss|enregistr|fait)/i, '').replace(/^(une|un|la|le|de|du)\s+/i, '').trim();
    if (!description || description.length < 2) description = 'Vente enregistrée par Oby';

    await pool.query(
      'INSERT INTO sales (user_id, description, amount, payment_method) VALUES ($1, $2, $3, $4)',
      [userId, description, amount, 'cash']
    );

    return `✅ Super ! J'ai enregistré ta vente « ${description} » pour ${amount.toLocaleString('fr-FR')} FCFA. Tu gères ! 🎉\n\nVeux-tu que je l'associe à un client ou que je t'affiche tes stats du jour ?`;
  }

  // Detect client creation
  const clientAddMatch = lower.match(/(?:ajout|cr[ée]|cr[ée]e|nouve(?:au|lle)|enregistr).*(?:client|cliente)/) ||
                         lower.match(/(?:client|cliente).*(?:ajout|cr[ée]|cr[ée]e|nouve(?:au|lle)|enregistr)/);
  if (clientAddMatch) {
    const nameMatch = message.match(/(?:appel[ée]e?|nomm[ée]e?|prénom[ée]e?|est)\s+([A-Za-zÀ-ÿ-]+)/i);
    const name = nameMatch ? nameMatch[1] : 'Nouveau client';
    await pool.query(
      'INSERT INTO clients (user_id, name) VALUES ($1, $2)',
      [userId, name]
    );
    return `✅ Parfait ! J'ai ajouté le client « ${name} » à ton carnet. 📇\n\nTu peux lui associer un téléphone ou une dette depuis l'onglet Clients.`;
  }

  // Detect stats request
  if (/(combien|stat|total|r[ée]sum|bilan|comment va)/i.test(lower)) {
    const stats = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM sales WHERE user_id = $1 AND sale_date::date = CURRENT_DATE) as today_count,
        (SELECT COALESCE(SUM(amount),0) FROM sales WHERE user_id = $1 AND sale_date::date = CURRENT_DATE) as today_total,
        (SELECT COUNT(*) FROM clients WHERE user_id = $1) as clients_count,
        (SELECT COALESCE(SUM(amount),0) FROM sales WHERE user_id = $1) as total_revenue`,
      [userId]
    );
    const s = stats.rows[0];
    return `📊 Voici ton bilan :\n\n• Ventes du jour : ${s.today_count} (${parseInt(s.today_total).toLocaleString('fr-FR')} FCFA)\n• Clients au total : ${s.clients_count}\n• Revenu cumulé : ${parseInt(s.total_revenue).toLocaleString('fr-FR')} FCFA\n\nTu fais du bon travail ! 🚀`;
  }

  // Detect debt/reminder
  if (/(dette|doit|doivent|rappel|whatsapp|relanc)/i.test(lower)) {
    const debtors = await pool.query(
      'SELECT name, phone, amount_due FROM clients WHERE user_id = $1 AND amount_due > 0 ORDER BY amount_due DESC LIMIT 5',
      [userId]
    );
    if (debtors.rows.length) {
      const list = debtors.rows.map(d => `• ${d.name} : ${parseInt(d.amount_due).toLocaleString('fr-FR')} FCFA${d.phone ? ' 📱' : ''}`).join('\n');
      return `💰 Voici les clients qui doivent de l'argent :\n\n${list}\n\nTu peux envoyer un rappel WhatsApp depuis la fiche de chaque client ! 📲`;
    }
    return `Super, aucun de tes clients ne doit d'argent pour le moment ! 🎉 Tout est réglé.`;
  }

  // Greeting
  if (/(bonjour|salut|coucou|bonsoir|hey|hello)/i.test(lower)) {
    return `👋 Salut ! Je suis Oby, ton assistante Orange Mboa Business. Je peux t'aider à :\n\n• Enregistrer une vente (dis-moi le montant et la description)\n• Ajouter un client\n• Voir tes statistiques\n• Suivre les dettes de tes clients\n\nDis-moi ce que tu veux faire ! 😊`;
  }

  // Help
  if (/(aide|help|comment|que peux|que sais)/i.test(lower)) {
    return `Bien sûr ! Voici ce que je peux faire pour toi :\n\n📝 **Enregistrer une vente** — dis-moi par exemple « J'ai vendu un plat de poulet pour 3500 FCFA »\n📇 **Ajouter un client** — « Ajoute un client nommé Jean »\n📊 **Voir tes stats** — « Combien de ventes aujourd'hui ? »\n💰 **Suivre les dettes** — « Qui doit de l'argent ? »\n\nQu'est-ce qui te ferait plaisir ? 😊`;
  }

  // Default
  return `J'ai bien reçu ton message ! 😊 Je suis là pour t'aider à gérer ton activité.\n\nTu peux me demander d'enregistrer une vente, d'ajouter un client, de voir tes stats ou de suivre les dettes. Essaie par exemple : « J'ai vendu 5000 FCFA de brochettes » 🍢`;
}

module.exports = router;
