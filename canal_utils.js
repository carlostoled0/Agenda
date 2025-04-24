
async function obterChannelId(url) {
  const username = url.includes("@") ? url.split("@")[1] : "";
  if (!username) return null;

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${username}&key=AIzaSyCD27OXrL7tmgDxOg7wQLR5QmRUGJPsqFg`);
    const data = await res.json();
    return data?.items?.[0]?.id || null;
  } catch (e) {
    console.error("Erro ao buscar channelId:", e);
    return null;
  }
}
