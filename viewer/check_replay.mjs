import fs from 'node:fs';
import crypto from 'node:crypto';
globalThis.performance ??= { now: () => 0 };
const {parseFrame, validateReplayManifest} = await import('./protocol.mjs');
const dir = process.argv[2];
const m = JSON.parse(fs.readFileSync(`${dir}/manifest.json`));
const allowed = validateReplayManifest(m);
const buf = fs.readFileSync(`${dir}/${m.binary}`);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const sha = crypto.createHash('sha256').update(buf).digest('hex');
console.log('binary_sha256 match:', sha === m.binary_sha256, '| bytes:', buf.byteLength === m.byte_length);
let worstGap = 0, worstAt = -1, prev = null;
for (let i = 0; i < m.frame_count; i++) {
  const f = parseFrame(ab, i * m.frame_bytes, m.frame_bytes, allowed);
  if (prev) {
    const gap = Math.abs(f.sim - prev.sim - 1 / m.fps);
    if (gap > worstGap) { worstGap = gap; worstAt = i; }
    if (f.tick <= prev.tick || f.sim <= prev.sim) throw Error(`non-monotonic at ${i}`);
  }
  prev = f;
}
console.log('worst |gap - 1/fps| =', worstGap.toExponential(3), 'at frame', worstAt,
            '| viewer threshold 1e-5 ->', worstGap > 1e-5 ? 'WOULD THROW' : 'ok');
console.log('start/end match:', Math.abs(JSON.parse(fs.readFileSync(`${dir}/manifest.json`)).start_sim_time - parseFrame(ab,0,m.frame_bytes,allowed).sim) < 1e-6, prev.sim.toFixed(6), m.end_sim_time.toFixed(6));
