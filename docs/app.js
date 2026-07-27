/**
 * BudgetScan - Interactive Web Logic & Auction Engine Simulator
 * Supports dual-language (EN / CS) terminal output & credit-based pay-per-scan calculations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuctionTimer();
  initCalculator();
  initDemoTerminal();
});

/* -------------------------------------------------------------------------- */
/* 1. Live Auction Countdown Timer in Hero Banner                            */
/* -------------------------------------------------------------------------- */
function initAuctionTimer() {
  let seconds = 45;
  const timerEl = document.getElementById('auction-timer');
  if (!timerEl) return;

  const isCs = document.documentElement.lang === 'cs';
  const labelSuffix = isCs ? 'zbývá' : 'remaining';

  setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      seconds = 60;
    }
    const secsStr = seconds < 10 ? `0${seconds}` : seconds;
    timerEl.textContent = `00:${secsStr}s ${labelSuffix}`;
  }, 1000);
}

/* -------------------------------------------------------------------------- */
/* 2. Interactive Calculator (Pay-Per-Scan Credit vs Seat Subscriptions)     */
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

    // Pay-per-scan actual spend (avg actual scan cost is ~25% of the max budget cap due to spot bidding & SQLite cache)
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
/* 3. Interactive PR/MR Auction Terminal Simulator                           */
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
      scanTime: '38 ms',
      budgetCap: '$1.50',
      maxDelay: '5m',
      actualCost: '$0.161',
      bids: [
        { provider: 'OCI Spot Node (fra-1)', cost: '$0.041', time: '1.2s', status: 'SELECTED (Within SLA & Budget)' },
        { provider: 'AI Patch Engine', cost: '$0.120', time: '0.8s', status: 'DIFF INCLUDED' }
      ],
      aiFix: 'Generated patch with std::unique_ptr & bounds check sanitization.',
      creditRem: '$248.34'
    },
    'go-concurrency': {
      cmd: '@budgetscan $0.75 --max-delay 2m',
      vuln: 'Data Race in session_store.go & Potential SQL Injection',
      scanTime: '24 ms',
      budgetCap: '$0.75',
      maxDelay: '2m',
      actualCost: '$0.085',
      bids: [
        { provider: 'Hetzner Spot Node (nbg1)', cost: '$0.025', time: '0.5s', status: 'SELECTED (Fastest Spot Node)' },
        { provider: 'AST Security Matcher', cost: '$0.060', time: '0.3s', status: 'ANALYSIS COMPLETED' }
      ],
      aiFix: 'Parameterized SQL query & added sync.RWMutex lock to SessionStore.',
      creditRem: '$248.41'
    },
    'py-security': {
      cmd: '@budgetscan $0.30',
      vuln: 'Unsanitized eval() input in data_loader.py:42',
      scanTime: '18 ms',
      budgetCap: '$0.30',
      maxDelay: 'None',
      actualCost: '$0.032',
      bids: [
        { provider: 'Local AST Cache / Spot Micro', cost: '$0.032', time: '0.2s', status: 'SELECTED' }
      ],
      aiFix: 'Replaced eval() with safe ast.literal_eval() execution.',
      creditRem: '$248.46'
    }
  };

  const scenariosCs = {
    'c-memory': {
      cmd: '@budgetscan $1.50 --max-delay 5m',
      vuln: 'Use-After-Free & Buffer Overflow v buffer_allocator.cpp:88',
      scanTime: '38 ms',
      budgetCap: '$1.50',
      maxDelay: '5m',
      actualCost: '$0.161',
      bids: [
        { provider: 'OCI Spot Uzel (fra-1)', cost: '$0.041', time: '1.2s', status: 'VYBRÁNO (V rámci SLA & Rozpočtu)' },
        { provider: 'AI Patch Engine', cost: '$0.120', time: '0.8s', status: 'DIFF PŘIPOJEN' }
      ],
      aiFix: 'Vytvořen patch s std::unique_ptr & kontrolou mezí.',
      creditRem: '$248.34'
    },
    'go-concurrency': {
      cmd: '@budgetscan $0.75 --max-delay 2m',
      vuln: 'Data Race v session_store.go & Potenciální SQL Injection',
      scanTime: '24 ms',
      budgetCap: '$0.75',
      maxDelay: '2m',
      actualCost: '$0.085',
      bids: [
        { provider: 'Hetzner Spot Uzel (nbg1)', cost: '$0.025', time: '0.5s', status: 'VYBRÁNO (Nejrychlejší Spot Uzel)' },
        { provider: 'AST Security Matcher', cost: '$0.060', time: '0.3s', status: 'ANALÝZA DOKONČENA' }
      ],
      aiFix: 'Parametrizován SQL dotaz & přidán sync.RWMutex zámek do SessionStore.',
      creditRem: '$248.41'
    },
    'py-security': {
      cmd: '@budgetscan $0.30',
      vuln: 'Neošetřený eval() vstup v data_loader.py:42',
      scanTime: '18 ms',
      budgetCap: '$0.30',
      maxDelay: 'Není',
      actualCost: '$0.032',
      bids: [
        { provider: 'Lokální AST Cache / Spot Mikro', cost: '$0.032', time: '0.2s', status: 'VYBRÁNO' }
      ],
      aiFix: 'Nahrazeno ast.literal_eval() pro bezpečné zpracování dat.',
      creditRem: '$248.46'
    }
  };

  const scenarios = isCs ? scenariosCs : scenariosEn;

  btnRun.addEventListener('click', () => {
    const key = selectPR.value;
    const data = scenarios[key];

    terminal.innerHTML = '';
    appendTerminalLine(`> reviewer: ${data.cmd}`, 'prompt');

    setTimeout(() => {
      appendTerminalLine(isCs 
        ? `[1/4] ⚙️  Zpracování příkazu... Limit rozpočtu: ${data.budgetCap} | Garance času (SLA): ${data.maxDelay}` 
        : `[1/4] ⚙️  Processing PR command... Budget Cap: ${data.budgetCap} | SLA Limit: ${data.maxDelay}`, 'info');
    }, 300);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[2/4] ⚠️  DETEKOVÁNA ZRANITELNOST: ${data.vuln} (Čas skenování: ${data.scanTime})`
        : `[2/4] ⚠️  VULNERABILITY DETECTED: ${data.vuln} (Scan duration: ${data.scanTime})`, 'danger');
    }, 700);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[3/4] 🏆 Výsledek aukce a alokace výkonu:`
        : `[3/4] 🏆 Spot Auction & Resource Allocation Summary:`, 'warning');
      
      data.bids.forEach(bid => {
        appendTerminalLine(`   • ${bid.provider} -> ${bid.cost} (${bid.time}) [${bid.status}]`, 'success');
      });
    }, 1200);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[4/4] ⚡ OPRAVNÝ PATCH: ${data.aiFix}`
        : `[4/4] ⚡ REMEDIATION PATCH: ${data.aiFix}`, 'success');
      
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
