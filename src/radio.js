// Live Jamaican internet radio — real stations streamed straight into the game.
//
// Each URL is a zeno.fm mount that was VERIFIED reachable over https with Content-Type
// audio/mpeg and `Access-Control-Allow-Origin: *` (so it plays on the HTTPS build with no
// proxy and no CORS trouble). zeno.fm 302-redirects to a token-signed CDN URL; a plain
// <audio> element follows that automatically. The CDN edge can occasionally 503 under
// load, so the player can always tap to switch station and the audio layer reconnects on
// a dropout (see audio.js playRadio).
export const STATIONS = [
  { name: 'IRIE FM',            url: 'https://stream.zeno.fm/c8n3ft7zmumtv' },
  { name: 'ZIP 103 FM',         url: 'https://stream.zeno.fm/4fazmm93yceuv' },
  { name: 'FAME 95 FM',         url: 'https://stream.zeno.fm/wbsd59gcgy5tv' },
  { name: 'LOVE 101 FM',        url: 'https://stream.zeno.fm/webzstrtpy5tv' },
  { name: 'ROOTS 96.1 FM',      url: 'https://stream.zeno.fm/8w8vu5t7nbruv' },
  { name: 'NATIONWIDE NEWS',    url: 'https://stream.zeno.fm/8zvh957sfvduv' },
  { name: 'BESS FM',            url: 'https://stream.zeno.fm/bavioxvjrrxvv' },
  { name: 'JAHKNO DANCEHALL',   url: 'https://stream.zeno.fm/y54tzrm9g0hvv' },
  { name: 'REGGAE & DANCEHALL', url: 'https://stream.zeno.fm/g6x5gntg4nhvv' },
];

export function stationCount() { return STATIONS.length; }

/** Station at index `i`, wrapping safely (handles negatives / out-of-range). */
export function stationAt(i) {
  const n = STATIONS.length;
  if (!n) return null;
  return STATIONS[((Math.trunc(i || 0) % n) + n) % n];
}
