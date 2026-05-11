import { useState } from 'react';
import { Monitor, Palette, Shield, Zap, Globe, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const SECTIONS = [
  { id: 'display', icon: Monitor, label: 'Display' },
  { id: 'theme', icon: Palette, label: 'Theme' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'power', icon: Zap, label: 'Power' },
  { id: 'network', icon: Globe, label: 'Network' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
];

export default function SettingsApp() {
  const [activeSection, setActiveSection] = useState('display');
  const [settings, setSettings] = useState({
    brightness: [75],
    shieldStrength: [95],
    warpNotifications: true,
    proxAlert: true,
    autoShields: true,
    darkMode: true,
    powerSaver: false,
    ftlComms: true,
  });

  return (
    <div className="h-full flex bg-[hsl(230,25%,7%)]">
      {/* Sidebar */}
      <div className="w-44 border-r border-border/30 p-2">
        <div className="space-y-0.5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                activeSection === s.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/50 hover:text-foreground/80 hover:bg-muted/20'
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span className="font-inter">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeSection === 'display' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Display Settings</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs text-foreground/60 font-inter">Screen Brightness</label>
                <Slider
                  value={settings.brightness}
                  onValueChange={v => setSettings(p => ({ ...p, brightness: v }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-[11px] text-muted-foreground">{settings.brightness[0]}%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border/20">
                <div>
                  <p className="text-sm text-foreground/80">Dark Mode</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Reduce eye strain in deep space</p>
                </div>
                <Switch checked={settings.darkMode} onCheckedChange={v => setSettings(p => ({ ...p, darkMode: v }))} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Security</h3>
            <div className="space-y-3">
              <label className="text-xs text-foreground/60 font-inter">Shield Strength</label>
              <Slider
                value={settings.shieldStrength}
                onValueChange={v => setSettings(p => ({ ...p, shieldStrength: v }))}
                max={100}
                step={1}
              />
              <span className="text-[11px] text-muted-foreground">{settings.shieldStrength[0]}%</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-border/20">
              <div>
                <p className="text-sm text-foreground/80">Auto-Shields</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Activate on threat detection</p>
              </div>
              <Switch checked={settings.autoShields} onCheckedChange={v => setSettings(p => ({ ...p, autoShields: v }))} />
            </div>
          </div>
        )}

        {activeSection === 'power' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Power Management</h3>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-foreground/80">Power Saver Mode</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Limit non-essential systems</p>
              </div>
              <Switch checked={settings.powerSaver} onCheckedChange={v => setSettings(p => ({ ...p, powerSaver: v }))} />
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20">
              <p className="text-xs text-foreground/60 mb-2">Power Distribution</p>
              <div className="space-y-2">
                {[
                  { label: 'Warp Drive', pct: 42 },
                  { label: 'Life Support', pct: 25 },
                  { label: 'Shields', pct: 18 },
                  { label: 'Comms', pct: 10 },
                  { label: 'Other', pct: 5 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[11px] text-foreground/50 w-20">{item.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'network' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Network</h3>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-foreground/80">FTL Communications</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Faster-than-light relay active</p>
              </div>
              <Switch checked={settings.ftlComms} onCheckedChange={v => setSettings(p => ({ ...p, ftlComms: v }))} />
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/20">
              <p className="text-xs text-foreground/60 mb-2">Connected Relays</p>
              {['Sol Relay Alpha', 'Proxima Relay B', 'Deep Space Node 7'].map(r => (
                <div key={r} className="flex items-center justify-between py-2">
                  <span className="text-xs text-foreground/70">{r}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-500/70">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Alert Settings</h3>
            <div className="space-y-1">
              {[
                { key: 'warpNotifications', title: 'Warp Events', desc: 'Notify on warp transitions' },
                { key: 'proxAlert', title: 'Proximity Alerts', desc: 'Warn about nearby objects' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/10">
                  <div>
                    <p className="text-sm text-foreground/80">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Switch checked={settings[item.key]} onCheckedChange={v => setSettings(p => ({ ...p, [item.key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'theme' && (
          <div className="space-y-6">
            <h3 className="text-sm font-orbitron tracking-wider text-foreground/80 uppercase">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Nebula', colors: ['#0a0f1e', '#1a1040', '#00d4ff'] },
                { name: 'Mars', colors: ['#1a0a0a', '#401010', '#ff4040'] },
                { name: 'Aurora', colors: ['#0a1a0a', '#104020', '#40ff80'] },
              ].map(theme => (
                <button key={theme.name} className="p-3 rounded-xl border border-border/30 hover:border-primary/40 transition-colors group">
                  <div className="flex gap-1 mb-2">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-xs text-foreground/60 group-hover:text-foreground">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}