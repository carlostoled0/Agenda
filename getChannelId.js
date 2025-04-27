
export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username é obrigatório." });
  }

  try {
    const response = await fetch(`https://www.youtube.com/@${username}`);
    const html = await response.text();
    const match = html.match(/"channelId":"(UC[\w-]+)/);

    if (match && match[1]) {
      res.status(200).json({ channelId: match[1] });
    } else {
      res.status(404).json({ error: "ChannelId não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o ChannelId." });
  }
}
