/**
 * BudgetScan - Interactive Web Logic & Auction Engine Simulator
 * Supports dual-language (EN / CS) terminal output detection.
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
/* 2. Interactive Calculator (ROI & Cloud Spot Savings)                      */
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
    const rate = parseInt(inputRate.value, 10);

    valPRs.textContent = prs;
    valDevs.textContent = devs;
    valRate.textContent = rate;

    // Calculation formulas:
    const hoursSavedPerYear = Math.round((prs * 12 * 2.2));
    const devCostSaved = hoursSavedPerYear * rate;

    const cloudSaved = Math.round((prs * 12 * 0.42 * 10));
    const vulnsPrevented = Math.round(prs * 12 * 0.022);

    const totalSavings = devCostSaved + cloudSaved;

    resTotal.textContent = `$${totalSavings.toLocaleString()}`;
    resHours.textContent = isCs 
      ? `${hoursSavedPerYear.toLocaleString()} hod / rok` 
      : `${hoursSavedPerYear.toLocaleString()} hrs / year`;
    
    resCloud.textContent = `74% (-$${cloudSaved.toLocaleString()})`;
    resVulns.textContent = isCs 
      ? `~${vulnsPrevented} kritických` 
      : `~${vulnsPrevented} critical`;
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
      prName: 'PR #204 (C++ Engine Refactor)',
      vuln: 'Use-After-Free & Buffer Overflow in buffer_allocator.cpp:88',
      scanTime: '38 ms',
      astNodes: '14,290 nodes scanned',
      spotBids: [
        { provider: 'Oracle OCI Spot (fra-1)', cost: '$0.038', time: '1.2s', status: 'WINNER (Lowest Price)' },
        { provider: 'AWS EC2 Spot (c6i.xlarge)', cost: '$0.065', time: '1.4s', status: 'Outbid' },
        { provider: 'Hetzner Dedicated Spot', cost: '$0.042', time: '1.8s', status: 'Outbid' }
      ],
      aiFix: 'Auto-generated patch with std::unique_ptr & bounds checking.',
      bounty: '0.005 ETH / AI Auto-Merge'
    },
    'go-concurrency': {
      prName: 'PR #189 (Go API Gateway)',
      vuln: 'Data Race in session_store.go & Potential SQL Injection in query_builder.go',
      scanTime: '24 ms',
      astNodes: '8,410 nodes scanned',
      spotBids: [
        { provider: 'Hetzner Cloud Spot (nbg1)', cost: '$0.021', time: '0.9s', status: 'WINNER (Fastest Node)' },
        { provider: 'AWS Spot (t4g.medium)', cost: '$0.035', time: '1.1s', status: 'Outbid' }
      ],
      aiFix: 'Parameterized SQL query + added sync.RWMutex lock to SessionStore struct.',
      bounty: '0.002 SOL / Verified'
    },
    'py-security': {
      prName: 'PR #312 (Python Data Pipeline)',
      vuln: 'Unsanitized eval() input in data_loader.py:42',
      scanTime: '18 ms',
      astNodes: '5,120 nodes scanned',
      spotBids: [
        { provider: 'Oracle OCI Spot (prg-1)', cost: '$0.015', time: '0.6s', status: 'WINNER' }
      ],
      aiFix: 'Replaced eval() with safe ast.literal_eval() execution.',
      bounty: 'Auto-Fix Ready'
    }
  };

  const scenariosCs = {
    'c-memory': {
      prName: 'PR #204 (C++ Engine Refactor)',
      vuln: 'Use-After-Free & Buffer Overflow v buffer_allocator.cpp:88',
      scanTime: '38 ms',
      astNodes: '14 290 uzlů vyskenováno',
      spotBids: [
        { provider: 'Oracle OCI Spot (fra-1)', cost: '$0.038', time: '1.2s', status: 'VÍTĚZ (Nejnižší cena)' },
        { provider: 'AWS EC2 Spot (c6i.xlarge)', cost: '$0.065', time: '1.4s', status: 'Překročeno' },
        { provider: 'Hetzner Dedicated Spot', cost: '$0.042', time: '1.8s', status: 'Překročeno' }
      ],
      aiFix: 'Vytvořen auto-patch s std::unique_ptr & sanitizací mezí.',
      bounty: '0.005 ETH / AI Auto-Merge'
    },
    'go-concurrency': {
      prName: 'PR #189 (Go API Gateway)',
      vuln: 'Data Race v session_store.go & Potenciální SQL Injection v query_builder.go',
      scanTime: '24 ms',
      astNodes: '8 410 uzlů vyskenováno',
      spotBids: [
        { provider: 'Hetzner Cloud Spot (nbg1)', cost: '$0.021', time: '0.9s', status: 'VÍTĚZ (Nejrychlejší uzel)' },
        { provider: 'AWS Spot (t4g.medium)', cost: '$0.035', time: '1.1s', status: 'Překročeno' }
      ],
      aiFix: 'Parametrizován SQL dotaz + přidán sync.RWMutex zámek do SessionStore.',
      bounty: '0.002 SOL / Ověřeno'
    },
    'py-security': {
      prName: 'PR #312 (Python Data Pipeline)',
      vuln: 'Neošetřený eval() vstup v data_loader.py:42',
      scanTime: '18 ms',
      astNodes: '5 120 uzlů vyskenováno',
      spotBids: [
        { provider: 'Oracle OCI Spot (prg-1)', cost: '$0.015', time: '0.6s', status: 'VÍTĚZ' }
      ],
      aiFix: 'Nahrazeno ast.literal_eval() pro bezpečné zpracování dat.',
      bounty: 'Připraveno k Auto-Fixu'
    }
  };

  const scenarios = isCs ? scenariosCs : scenariosEn;

  btnRun.addEventListener('click', () => {
    const key = selectPR.value;
    const data = scenarios[key];

    terminal.innerHTML = '';
    appendTerminalLine(`> @budgetscan audit --auction-mode --pr=${data.prName}`, 'prompt');

    setTimeout(() => {
      appendTerminalLine(isCs 
        ? `[1/4] 🔍 Inicializace Tree-sitter AST Skenování... (${data.astNodes})` 
        : `[1/4] 🔍 Initializing Tree-sitter AST Parsing... (${data.astNodes})`, 'info');
    }, 300);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[2/4] ⚠️  DETEKOVÁNA ZRANITELNOST: ${data.vuln} (Čas skenování: ${data.scanTime})`
        : `[2/4] ⚠️  VULNERABILITY DETECTED: ${data.vuln} (Scan time: ${data.scanTime})`, 'danger');
    }, 700);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[3/4] 🏆 Otevřena reverzní aukce výpočetního výkonu pro hloubkovou analýzu:`
        : `[3/4] 🏆 Opened reverse infrastructure spot-auction for deep analysis:`, 'warning');
      
      data.spotBids.forEach(bid => {
        const isWinner = bid.status.includes('WINNER') || bid.status.includes('VÍTĚZ');
        appendTerminalLine(`   • ${bid.provider} -> ${bid.cost} (Time: ${bid.time}) [${bid.status}]`, isWinner ? 'success' : 'prompt');
      });
    }, 1200);

    setTimeout(() => {
      appendTerminalLine(isCs
        ? `[4/4] ⚡ AUKČNÍ NÁVRH OPRAVY: ${data.aiFix}`
        : `[4/4] ⚡ AUCTION REMEDIATION PROPOSAL: ${data.aiFix}`, 'success');
      
      appendTerminalLine(isCs
        ? `   👉 Mikrobounty alokováno: ${data.bounty}. Připraveno k automatickému schválení u PR/MR.`
        : `   👉 Micro-bounty allocated: ${data.bounty}. Ready for PR/MR auto-merge approval.`, 'info');
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
