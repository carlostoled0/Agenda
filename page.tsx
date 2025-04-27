
'use client';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchChannelInfo() {
    setLoading(true);
    setError('');
    try {
      const apiKey = 'SUA_API_KEY_AQUI';
      let channelId = input;

      if (input.includes('youtube.com')) {
        const username = input.split('@')[1];
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?forUsername=${username}&part=id&key=${apiKey}`);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          channelId = data.items[0].id;
        } else {
          throw new Error('Canal não encontrado.');
        }
      }

      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setChannelData(data.items[0]);
      } else {
        throw new Error('Canal não encontrado.');
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar dados do canal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Painel de Análise Profissional</h1>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Cole a URL ou ID do canal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none"
        />
        <button
          onClick={fetchChannelInfo}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Analisar
        </button>
      </div>
      {loading && <p className="mt-6 text-gray-600">Analisando canal...</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {channelData && (
        <div className="mt-8 bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">{channelData.snippet.title}</h2>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Inscritos:</strong> {parseInt(channelData.statistics.subscriberCount).toLocaleString()}</li>
            <li><strong>Visualizações:</strong> {parseInt(channelData.statistics.viewCount).toLocaleString()}</li>
            <li><strong>Vídeos:</strong> {parseInt(channelData.statistics.videoCount).toLocaleString()}</li>
          </ul>
        </div>
      )}
      <footer className="mt-12 text-gray-400 text-sm">
        © 2025 Painel Profissional
      </footer>
    </div>
  );
}
