import { useState } from 'react';
import { Search, ExternalLink, Loader2, ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUICK_LINKS = [
  { name: 'Space News', query: 'latest space exploration news 2026' },
  { name: 'Tech Headlines', query: 'top technology news today' },
  { name: 'Science', query: 'latest science discoveries 2026' },
  { name: 'AI Updates', query: 'artificial intelligence news today' },
  { name: 'Astronomy', query: 'astronomy discoveries this week' },
];

export default function BrowserApp() {
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setInput(trimmed);
    setLoading(true);
    setResults(null);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a search engine. The user searched for: "${trimmed}"
        
Return a JSON with:
- summary: a 2-3 sentence answer/overview of the topic
- results: array of 6 relevant results, each with:
  - title: page title
  - url: a real, plausible URL
  - description: 1-2 sentence description of what this page contains
  - source: domain name (e.g. "nasa.gov")
- related: array of 4 related search suggestions (short strings)

Focus on being accurate, informative, and relevant. Use real websites that actually exist.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  url: { type: 'string' },
                  description: { type: 'string' },
                  source: { type: 'string' },
                },
              },
            },
            related: { type: 'array', items: { type: 'string' } },
          },
        },
      });
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') search(input);
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(230,25%,7%)]">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-[hsl(230,25%,9%)]">
        {results && (
          <button
            onClick={() => { setResults(null); setQuery(''); setInput(''); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground/60" />
          </button>
        )}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search Nova..."
            className="flex-1 bg-transparent text-xs text-foreground/80 focus:outline-none font-mono placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => search(input)}
          className="h-7 px-3 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs transition-colors font-orbitron"
        >
          Search
        </button>
      </div>

      {/* Home screen */}
      {!results && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-orbitron text-foreground/90 glow-text">Nova Search</h1>
            </div>
            <p className="text-xs text-muted-foreground">AI-powered search with real-time internet access</p>
          </div>

          <div className="w-full max-w-lg flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/20 border border-border/40 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_hsl(190_100%_55%/0.1)]">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search anything..."
              className="flex-1 bg-transparent text-sm text-foreground/80 focus:outline-none font-inter placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map(l => (
              <button
                key={l.name}
                onClick={() => search(l.query)}
                className="px-3 py-1.5 rounded-full bg-muted/20 hover:bg-primary/10 border border-border/30 hover:border-primary/30 text-xs text-muted-foreground hover:text-primary transition-all"
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">Searching the galaxy...</p>
          <p className="text-xs text-muted-foreground/50">"{query}"</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Query header */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Results for</p>
            <h2 className="text-lg font-orbitron text-foreground/90">{query}</h2>
          </div>

          {/* AI Summary */}
          {results.summary && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-orbitron text-primary uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed">{results.summary}</p>
            </div>
          )}

          {/* Search results */}
          <div className="space-y-3">
            {results.results?.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/10 hover:bg-muted/20 border border-border/20 hover:border-border/40 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-green-500 font-mono mb-1">{r.source}</p>
                    <h3 className="text-sm font-medium text-primary/90 group-hover:text-primary transition-colors leading-snug mb-1">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                    <p className="text-[10px] text-muted-foreground/40 font-mono mt-1.5 truncate">{r.url}</p>
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors mt-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Related searches */}
          {results.related?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-orbitron uppercase tracking-wider">Related Searches</p>
              <div className="flex flex-wrap gap-2">
                {results.related.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => search(r)}
                    className="px-3 py-1.5 rounded-full bg-muted/20 hover:bg-primary/10 border border-border/30 hover:border-primary/30 text-xs text-muted-foreground hover:text-primary transition-all"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}