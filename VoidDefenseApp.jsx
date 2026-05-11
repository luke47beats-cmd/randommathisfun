import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_W = 20;
const GRID_H = 14;
const CELL = 32;

const TOWER_TYPES = {
  laser: { name: 'Laser', cost: 50, range: 3, damage: 15, rate: 60, color: '#00e5ff', symbol: 'L' },
  missile: { name: 'Missile', cost: 100, range: 5, damage: 40, rate: 120, color: '#ff6b35', symbol: 'M' },
  plasma: { name: 'Plasma', cost: 150, range: 4, damage: 25, rate: 45, color: '#b44fff', symbol: 'P' },
};

const PATH = [
  {x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:4,y:4},{x:4,y:5},{x:4,y:6},
  {x:5,y:6},{x:6,y:6},{x:7,y:6},{x:8,y:6},{x:8,y:5},{x:8,y:4},{x:8,y:3},{x:9,y:3},
  {x:10,y:3},{x:11,y:3},{x:11,y:4},{x:11,y:5},{x:11,y:6},{x:11,y:7},{x:11,y:8},
  {x:12,y:8},{x:13,y:8},{x:14,y:8},{x:14,y:7},{x:14,y:6},{x:14,y:5},{x:15,y:5},
  {x:16,y:5},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},
  {x:18,y:10},{x:19,y:10}
];

const pathSet = new Set(PATH.map(p => `${p.x},${p.y}`));

export default function VoidDefenseApp() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    towers: [],
    enemies: [],
    projectiles: [],
    wave: 1,
    lives: 20,
    gold: 200,
    score: 0,
    tick: 0,
    spawnQueue: [],
    spawnTimer: 0,
    gameOver: false,
    waveActive: false,
    nextEnemyId: 0,
    nextProjId: 0,
  });
  const [ui, setUi] = useState({ wave: 1, lives: 20, gold: 200, score: 0, gameOver: false, waveActive: false });
  const [selectedTower, setSelectedTower] = useState('laser');
  const rafRef = useRef(null);

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) return;
    s.tick++;

    // Spawn enemies
    if (s.waveActive && s.spawnQueue.length > 0) {
      s.spawnTimer++;
      if (s.spawnTimer >= 40) {
        s.spawnTimer = 0;
        const hp = s.spawnQueue.shift();
        s.enemies.push({ id: s.nextEnemyId++, pathIdx: 0, progress: 0, hp, maxHp: hp, speed: 0.04 + s.wave * 0.005 });
      }
    }
    if (s.waveActive && s.spawnQueue.length === 0 && s.enemies.length === 0) {
      s.waveActive = false;
      s.gold += 50 + s.wave * 10;
    }

    // Move enemies
    s.enemies = s.enemies.filter(e => {
      e.progress += e.speed;
      if (e.progress >= 1) {
        e.progress = 0;
        e.pathIdx++;
        if (e.pathIdx >= PATH.length - 1) {
          s.lives = Math.max(0, s.lives - 1);
          if (s.lives <= 0) s.gameOver = true;
          return false;
        }
      }
      return true;
    });

    // Tower attacks
    s.towers.forEach(t => {
      t.cooldown = (t.cooldown || 0) - 1;
      if (t.cooldown > 0) return;
      const tdef = TOWER_TYPES[t.type];
      const target = s.enemies.find(e => {
        const pos = PATH[Math.min(e.pathIdx, PATH.length - 1)];
        return dist(t, pos) <= tdef.range;
      });
      if (target) {
        t.cooldown = tdef.rate;
        const pos = PATH[Math.min(target.pathIdx, PATH.length - 1)];
        s.projectiles.push({ id: s.nextProjId++, x: t.x + 0.5, y: t.y + 0.5, tx: pos.x + 0.5, ty: pos.y + 0.5, targetId: target.id, damage: tdef.damage, color: tdef.color, progress: 0 });
      }
    });

    // Move projectiles
    s.projectiles = s.projectiles.filter(p => {
      p.progress += 0.15;
      if (p.progress >= 1) {
        const e = s.enemies.find(e => e.id === p.targetId);
        if (e) {
          e.hp -= p.damage;
          if (e.hp <= 0) {
            s.enemies = s.enemies.filter(e2 => e2.id !== e.id);
            s.score += 10;
            s.gold += 10;
          }
        }
        return false;
      }
      return true;
    });

    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    for (let x = 0; x < GRID_W; x++) {
      for (let y = 0; y < GRID_H; y++) {
        if (pathSet.has(`${x},${y}`)) {
          ctx.fillStyle = '#1a2030';
        } else {
          ctx.fillStyle = '#080c18';
        }
        ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
      }
    }

    // Path highlight
    PATH.forEach(p => {
      ctx.fillStyle = 'rgba(0,229,255,0.06)';
      ctx.fillRect(p.x * CELL, p.y * CELL, CELL - 1, CELL - 1);
    });

    // Towers
    s.towers.forEach(t => {
      const tdef = TOWER_TYPES[t.type];
      ctx.fillStyle = tdef.color + '33';
      ctx.fillRect(t.x * CELL + 2, t.y * CELL + 2, CELL - 5, CELL - 5);
      ctx.strokeStyle = tdef.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(t.x * CELL + 2, t.y * CELL + 2, CELL - 5, CELL - 5);
      ctx.fillStyle = tdef.color;
      ctx.font = `bold 14px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tdef.symbol, t.x * CELL + CELL / 2, t.y * CELL + CELL / 2);
    });

    // Enemies
    s.enemies.forEach(e => {
      const a = PATH[Math.min(e.pathIdx, PATH.length - 1)];
      const b = PATH[Math.min(e.pathIdx + 1, PATH.length - 1)];
      const ex = (a.x + (b.x - a.x) * e.progress + 0.5) * CELL;
      const ey = (a.y + (b.y - a.y) * e.progress + 0.5) * CELL;
      ctx.fillStyle = '#ff4466';
      ctx.beginPath();
      ctx.arc(ex, ey, 8, 0, Math.PI * 2);
      ctx.fill();
      // HP bar
      const hpFrac = e.hp / e.maxHp;
      ctx.fillStyle = '#333';
      ctx.fillRect(ex - 10, ey - 14, 20, 3);
      ctx.fillStyle = hpFrac > 0.5 ? '#44ff88' : hpFrac > 0.25 ? '#ffaa00' : '#ff4444';
      ctx.fillRect(ex - 10, ey - 14, 20 * hpFrac, 3);
    });

    // Projectiles
    s.projectiles.forEach(p => {
      const px = (p.x + (p.tx - p.x) * p.progress) * CELL;
      const py = (p.y + (p.ty - p.y) * p.progress) * CELL;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    setUi({ wave: s.wave, lives: s.lives, gold: s.gold, score: s.score, gameOver: s.gameOver, waveActive: s.waveActive });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleCanvasClick = (e) => {
    const s = stateRef.current;
    if (s.gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const gx = Math.floor((e.clientX - rect.left) / CELL);
    const gy = Math.floor((e.clientY - rect.top) / CELL);
    if (pathSet.has(`${gx},${gy}`)) return;
    if (s.towers.find(t => t.x === gx && t.y === gy)) return;
    const tdef = TOWER_TYPES[selectedTower];
    if (s.gold < tdef.cost) return;
    s.gold -= tdef.cost;
    s.towers.push({ x: gx, y: gy, type: selectedTower, cooldown: 0 });
  };

  const startWave = () => {
    const s = stateRef.current;
    if (s.waveActive || s.gameOver) return;
    const count = 8 + s.wave * 3;
    const hp = 50 + s.wave * 20;
    s.spawnQueue = Array.from({ length: count }, () => hp + Math.floor(Math.random() * 20));
    s.waveActive = true;
    s.wave++;
    setUi(u => ({ ...u, waveActive: true, wave: s.wave }));
  };

  const reset = () => {
    stateRef.current = { towers: [], enemies: [], projectiles: [], wave: 1, lives: 20, gold: 200, score: 0, tick: 0, spawnQueue: [], spawnTimer: 0, gameOver: false, waveActive: false, nextEnemyId: 0, nextProjId: 0 };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(230,25%,7%)]">
      {/* HUD */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-[hsl(230,25%,9%)] text-xs font-mono shrink-0">
        <div className="flex gap-4">
          <span className="text-amber-400">💰 {ui.gold}</span>
          <span className="text-red-400">❤️ {ui.lives}</span>
          <span className="text-primary">⭐ {ui.score}</span>
          <span className="text-foreground/60">Wave {ui.wave}</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(TOWER_TYPES).map(([key, t]) => (
            <button key={key} onClick={() => setSelectedTower(key)}
              className={`px-2 py-1 rounded text-[10px] transition-all border ${selectedTower === key ? 'border-current' : 'border-border/30 text-muted-foreground'}`}
              style={{ color: selectedTower === key ? t.color : undefined }}>
              [{t.symbol}] {t.name} ${t.cost}
            </button>
          ))}
          {!ui.waveActive && !ui.gameOver && (
            <button onClick={startWave} className="px-3 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary text-[10px] transition-all">
              ▶ Start Wave
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto relative">
        <canvas ref={canvasRef} width={GRID_W * CELL} height={GRID_H * CELL}
          onClick={handleCanvasClick} className="cursor-crosshair block" />
        {ui.gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
            <p className="text-2xl font-orbitron text-red-400">GAME OVER</p>
            <p className="text-sm text-muted-foreground">Score: {ui.score}</p>
            <button onClick={reset} className="px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-sm font-orbitron">
              Restart
            </button>
          </div>
        )}
      </div>
      <p className="px-3 py-1 text-[10px] text-muted-foreground border-t border-border/20 shrink-0">Click grid to place tower · Enemies follow the glowing path</p>
    </div>
  );
}