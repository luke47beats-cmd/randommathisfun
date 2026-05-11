<div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(app.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{app.rating} ({app.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleInstall(app.id, e)}
                  disabled={isInstalled || isInstalling}
                  className={`h-9 px-5 rounded-xl text-sm font-orbitron transition-all ${
                    isInstalled
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30 cursor-default'
                      : isInstalling
                      ? 'bg-primary/10 text-primary/60 cursor-wait'
                      : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30'
                  }`}
                >
                  {isInstalled ? '✓ Installed' : isInstalling ? 'Installing...' : 'Install'}
                </button>
                {canOpen && (
                  <button onClick={(e) => handleOpen(app.id, e)}
                    className="h-9 px-5 rounded-xl text-sm font-orbitron bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 transition-all flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{app.description}</p>
            </div>
            <div>
              <h3 className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {app.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-muted/20 border border-border/30 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[hsl(230,25%,7%)]">
      <div className="px-4 py-3 border-b border-border/30 bg-[hsl(230,25%,9%)] space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 focus-within:border-primary/40">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Nova Store..."
            className="flex-1 bg-transparent text-xs text-foreground/80 focus:outline-none font-mono placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs transition-all ${
                category === c
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted/20 text-muted-foreground border border-border/20 hover:border-border/40'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {category === 'All' && !search && (
          <div>
            <p className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-primary" /> Featured
            </p>
            <div className="grid grid-cols-3 gap-2">
              {featured.map(app => (
                <button key={app.id} onClick={() => setSelected(app.id)}
                  className="p-3 rounded-xl bg-muted/10 hover:bg-muted/20 border border-border/20 hover:border-border/40 transition-all text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${app.bgClass}`}>
                    <app.icon className={`w-5 h-5 ${app.iconColor}`} />
                  </div>
                  <p className="text-xs font-medium text-foreground/80 truncate">{app.name}</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-muted-foreground">{app.rating}</span>
                    {installed.has(app.id) && <span className="ml-1 text-[9px] text-green-400">✓ Installed</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          {category !== 'All' || search ? (
            <p className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider mb-2">
              {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-primary" /> All Apps
            </p>
          )}
          <div className="space-y-2">
            {filtered.map(app => {
              const isInstalled = installed.has(app.id);
              const isInstalling = installing.has(app.id);
              const canOpen = isInstalled && hasComponent(app.id);
              return (
                <button key={app.id} onClick={() => setSelected(app.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 border border-border/20 hover:border-border/40 transition-all text-left group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${app.bgClass}`}>
                    <app.icon className={`w-5 h-5 ${app.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-foreground/85">{app.name}</p>
                      <span className="text-[10px] text-muted-foreground/50 bg-muted/30 px-1.5 rounded">{app.category}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{app.description}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-muted-foreground">{app.rating} · {app.size}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    {canOpen && (
                      <button onClick={(e) => handleOpen(app.id, e)}
                        className="h-7 px-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-[10px] transition-all">
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={(e) => handleInstall(app.id, e)} disabled={isInstalled || isInstalling}
                      className={`h-7 px-3 rounded-lg text-[11px] font-orbitron transition-all ${
                        isInstalled
                          ? 'bg-green-500/10 text-green-400 cursor-default'
                          : isInstalling
                          ? 'bg-primary/10 text-primary/50 cursor-wait'
                          : 'bg-primary/15 hover:bg-primary/25 text-primary'
                      }`}>
                      {isInstalled ? <CheckCircle2 className="w-3.5 h-3.5" /> : isInstalling ? '...' : <Download className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}