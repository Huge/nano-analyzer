/**
 * BudgetScan - Interactive Web Logic & Conceptual Budget Simulator (mock data, no live scans)
 * Supports dual-language (EN / CS) terminal output & credit-based pay-per-scan calculations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initDemoTerminal();
});

/* -------------------------------------------------------------------------- */
/* 1. Interactive Calculator (Pay-Per-Scan Credit vs Seat Subscriptions)     */
/* -------------------------------------------------------------------------- */
function initCalculator() {
  const inputPRs = document.getElementById('input-prs');
  const inputDevs = document.getElementById('input-devs');
  const inputRate = document.getElementById('input-rate');

  const valPRs = document.getElementById('val-prs');
  const valDevs = document.getElementById('val-devs');
  const valRate = document.getElementById('val-rate');

  const resTotal = document.getElementById('res-total-savings');
  const resHours = document.getElementById('res-hours');
  const resCloud = document.getElementById('res-cloud-savings');
  const resVulns = document.getElementById('res-vulns');

  if (!inputPRs || !inputDevs || !inputRate) return;

  const isCs = document.documentElement.lang === 'cs';

  function updateCalc() {
    const prs = parseInt(inputPRs.value, 10);
    const devs = parseInt(inputDevs.value, 10);
    const avgBudget = parseFloat(inputRate.value);

    valPRs.textContent = prs;
    valDevs.textContent = devs;
    valRate.textContent = avgBudget.toFixed(2);

    // Pay-per-scan actual spend: placeholder assumption (actual ≈ 28% of cap) until real benchmark data replaces it
    const actualCostPerPR = avgBudget * 0.28;
    const monthlyCreditSpend = Math.round(prs * actualCostPerPR);
    
    // Traditional Enterprise SAST Seat Cost ($50 / dev / month)
    const traditionalSeatSpend = devs * 50;

    // Monthly savings vs seat subscriptions
    const monthlySavings = Math.max(0, traditionalSeatSpend - monthlyCreditSpend);
    const annualSavings = monthlySavings * 12;

    const savingsPercent = traditionalSeatSpend > 0 
      ? Math.round((monthlySavings / traditionalSeatSpend) * 100)
      : 0;

    resTotal.textContent = `$${annualSavings.toLocaleString()}`;
    resHours.textContent = isCs 
      ? `$${monthlyCreditSpend.toLocaleString()} / měsíc` 
      : `$${monthlyCreditSpend.toLocaleString()} / month`;
    
    resCloud.textContent = isCs
      ? `$${traditionalSeatSpend.toLocaleString()} / měsíc`
      : `$${traditionalSeatSpend.toLocaleString()} / month`;

    resVulns.textContent = isCs 
      ? `${savingsPercent}% úspora` 
      : `${savingsPercent}% saved`;
  }

  inputPRs.addEventListener('input', updateCalc);
  inputDevs.addEventListener('input', updateCalc);
  inputRate.addEventListener('input', updateCalc);

  updateCalc();
}

/* -------------------------------------------------------------------------- */
/* 2. Conceptual PR/MR Budget Simulator (mock data)                           */
/* -------------------------------------------------------------------------- */
function initDemoTerminal() {
  const selectPR = document.getElementById('demo-pr-select');
  const btnRun = document.getElementById('run-demo-btn');
  const terminal = document.getElementById('demo-terminal');

  if (!selectPR || !btnRun || !terminal) return;

  const isCs = document.documentElement.lang === 'cs';

  const scenariosEn = {
    'c-memory': {
      cmd: '@budgetscan $1.50 --max-delay 5m',
      vuln: 'Use-After-Free & Buffer Overflow in buffer_allocator.cpp:88',
      budgetCap: '$1.50',
      maxDelay: '5m',
      actualCost: '$0.161',
      bids: [
        { provider: 'LLM context + scan (changed files)', cost: '$0.041', status: 'WITHIN CAP & DEADLINE' },
        { provider: 'Skeptical triage (5 rounds)', cost: '$0.120', status: 'COMPLETED' }
      ],
      aiFix: 'Use std::unique_ptr for ownership and add a bounds check before the copy.',
      creditRem: '$248.34'
    },
    'go-concurrency': {
      cmd: '@budgetscan $0.75 --max-delay 2m',
      vuln: 'Data Race in session_store.go & Potential SQL Injection',
      budgetCap: '$0.75',
      maxDelay: '2m',
      actualCost: '$0.085',
      bids: [
        { provider: 'LLM context + scan (changed files)', cost: '$0.025', status: 'WITHIN CAP & DEADLINE' },
        { provider: 'Skeptical triage (3 rounds)', cost: '$0.060', status: 'COMPLETED' }
      ],
      aiFix: 'Use a parameterized SQL query and guard SessionStore with a sync.RWMutex.',
      creditRem: '$248.41'
    },
    'py-security': {
      cmd: '@budgetscan $0.30',
      vuln: 'Unsanitized eval() input in data_loader.py:42',
      budgetCap: '$0.30',
      maxDelay: 'None',
      actualCost: '$0.032',
      bids: [
        { provider: 'LLM scan + 1 triage round', cost: '$0.032', status: 'WITHIN CAP' }
      ],
      aiFix: 'Replace eval() with ast.literal_eval() for untrusted input.',
      creditRem: '$248.46'
    }
  };

  const scenariosCs = {
    'c-memory': {
      cmd: '@budgetscan $1.50 --max-delay 5m',
      vuln: 'Use-After-Free & Buffer Overflow v buffer_allocator.cpp:88',
      budgetCap: '$1.50',
      maxDelay: '5m',
      actualCost: '$0.161',
      bids: [
        { provider: 'LLM kontext + sken (změněné soubory)', cost: '$0.041', status: 'V RÁMCI LIMITU & TERMÍNU' },
        { provider: 'Skeptická triáž (5 kol)', cost: '$0.120', status: 'DOKONČENO' }
      ],
      aiFix: 'Použít std::unique_ptr pro vlastnictví paměti a přidat kontrolu mezí před kopírováním.',
      creditRem: '$248.34'
    },
    'go-concurrency': {
      cmd: '@budgetscan $0.75 --max-delay 2m',
      vuln: 'Data Race v session_store.go & Potenciální SQL Injection',
      budgetCap: '$0.75',
      maxDelay: '2m',
      actualCost: '$0.085',
      bids: [
        { provider: 'LLM kontext + sken (změněné soubory)', cost: '$0.025', status: 'V RÁMCI LIMITU & TERMÍNU' },
        { provider: 'Skeptická triáž (3 kola)', cost: '$0.060', status: 'DOKONČENO' }
      ],
      aiFix: 'Použít parametrizovaný SQL dotaz a chránit SessionStore pomocí sync.RWMutex.',
      creditRem: '$248.41'
    },
    'py-security': {
      cmd: '@budgetscan $0.30',
      vuln: 'Neošetřený eval() vstup v data_loader.py:42',
      budgetCap: '$0.30',
      maxDelay: 'Není',
      actualCost: '$0.032',
      bids: [
        { provider: 'LLM sken + 1 kolo triáže', cost: '$0.032', status: 'V RÁMCI LIMITU' }
      ],
      aiFix: 'Nahradit eval() funkcí ast.literal_eval() pro nedůvěryhodný vstup.',
      creditRem: '$248.46'
    }
  };

  const scenarios = isCs ? scenariosCs : scenariosEn;

  btnRun.addEventListener('click', () => {
    const key = selectPR.value;
    const data = scenarios[key];

    terminal.innerHTML = '';
    appendTerminalLine(isCs ? '# SIMULACE – ukázková data, žádný skutečný sken' : '# SIMULATION – mock data, no real scan is run', 'info');
    appendTerminalLine(`> reviewer: ${data.cmd}`, 'prompt');

    setTimeout(() => {
      appendTerminalLine(isCs 
        ? `[1/4] ⚙️  Zpracování příkazu... Limit rozpočtu: ${data.budgetCap} | Časový limit: ${data.maxDelay}` 
        : `[1/4] ⚙️  Processing PR command... Budget Cap: ${data.budgetCap} | Deadline: ${data.maxDelay}`, 'info');
    }, 300);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[2/4] ⚠️  DETEKOVÁNA ZRANITELNOST: ${data.vuln}`
        : `[2/4] ⚠️  VULNERABILITY DETECTED: ${data.vuln}`, 'danger');
    }, 700);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[3/4] 🏆 Rozdělení rozpočtu podle fází:`
        : `[3/4] 🏆 Budget Allocation by Stage:`, 'warning');
      
      data.bids.forEach(bid => {
        appendTerminalLine(`   • ${bid.provider} -> ${bid.cost} [${bid.status}]`, 'success');
      });
    }, 1200);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[4/4] 💡 NÁVRH OPRAVY: ${data.aiFix}`
        : `[4/4] 💡 SUGGESTED FIX: ${data.aiFix}`, 'success');
      
      appendTerminalLine(isCs
        ? `   💰 Odečteno z týmového kreditu: ${data.actualCost} (Úspora oproti limitu ${data.budgetCap}). Zbývající kredit: ${data.creditRem}`
        : `   💰 Deducted from team credit: ${data.actualCost} (Saved under ${data.budgetCap} cap). Remaining credit: ${data.creditRem}`, 'info');
    }, 1800);
  });

  function appendTerminalLine(text, type = 'prompt') {
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }
}
