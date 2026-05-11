import { useState } from 'react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);

  const handleNumber = (n) => {
    if (fresh) {
      setDisplay(n === '.' ? '0.' : n);
      setFresh(false);
    } else {
      if (n === '.' && display.includes('.')) return;
      setDisplay(display + n);
    }
  };

  const handleOp = (nextOp) => {
    const current = parseFloat(display);
    if (prev !== null && op && !fresh) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const calculate = (a, b, operator) => {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'ERR';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calculate(prev, current, op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const getButtonClass = (btn) => {
    if (['÷', '×', '-', '+', '='].includes(btn)) return 'bg-primary/20 hover:bg-primary/30 text-primary';
    if (['C', '±', '%'].includes(btn)) return 'bg-muted/40 hover:bg-muted/60 text-foreground/70';
    return 'bg-muted/20 hover:bg-muted/30 text-foreground/80';
  };

  const handleBtn = (btn) => {
    if (btn >= '0' && btn <= '9' || btn === '.') handleNumber(btn);
    else if (['+', '-', '×', '÷'].includes(btn)) handleOp(btn);
    else if (btn === '=') handleEquals();
    else if (btn === 'C') handleClear();
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="h-full bg-[hsl(230,25%,7%)] flex flex-col p-4">
      {/* Display */}
      <div className="mb-4 p-4 rounded-xl bg-muted/10 border border-border/20 text-right">
        {op && prev !== null && (
          <p className="text-xs text-muted-foreground font-mono mb-1">{prev} {op}</p>
        )}
        <p className="text-3xl font-orbitron text-foreground/90 tracking-wider truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-rows-5 gap-2">
        {buttons.map((row, ri) => (
          <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: ri === 4 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)' }}>
            {row.map(btn => (
              <button
                key={btn}
                onClick={() => handleBtn(btn)}
                className={`rounded-xl font-orbitron text-sm transition-all active:scale-95 ${getButtonClass(btn)}`}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}