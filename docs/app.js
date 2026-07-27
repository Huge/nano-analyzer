/**
 * BudgetScan - Interactive Web Logic & Auction Engine Simulator
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

  setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      seconds = 60;
    }
    const secsStr = seconds < 10 ? `0${seconds}` : seconds;
    timerEl.textContent = `00:${secsStr}s zbývá`;
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

  function updateCalc() {
    const prs = parseInt(inputPRs.value, 10);
    const devs = parseInt(inputDevs.value, 10);
    const rate = parseInt(inputRate.value, 10);

    valPRs.textContent = prs;
    valDevs.textContent = devs;
    valRate.textContent = rate;

    // Calculation formulas based on benchmark data:
    // 1. Time saved per PR = 2.5 hours of manual security review saved
    const hoursSavedPerYear = Math.round((prs * 12 * 2.2));
    const devCostSaved = hoursSavedPerYear * rate;

    // 2. Cloud Spot Reverse Auction savings: ~$45 saved per 100 scans vs fixed instances
    const cloudSaved = Math.round((prs * 12 * 0.42 * 10));

    // 3. Prevented critical zero-day bugs: ~0.025 per PR
    const vulnsPrevented = Math.round(prs * 12 * 0.022);

    const totalSavings = devCostSaved + cloudSaved;

    // Format output
    resTotal.textContent = `$${totalSavings.toLocaleString()}`;
    resHours.textContent = `${hoursSavedPerYear.toLocaleString()} hod / rok`;
    resCloud.textContent = `74 % (-$${cloudSaved.toLocaleString()})`;
    resVulns.textContent = `~${vulnsPrevented} kritických`;
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

  const scenarios = {
    'c-memory': {
      prName: 'PR #204 (C++ Engine Refactor)',
      vuln: 'Use-After-Free & Buffer Overflow v buffer_allocator.cpp:88',
      scanTime: '38 ms',
      astNodes: '14,290 nodes scanned',
      spotBids: [
        { provider: 'Oracle OCI Spot (fra-1)', cost: '$0.038', time: '1.2s', status: 'WYGRAŁ (Najniższa cena)' },
        { provider: 'AWS EC2 Spot (c6i.xlarge)', cost: '$0.065', time: '1.4s', status: 'Překročeno' },
        { provider: 'Hetzner Dedicated Spot', cost: '$0.042', time: '1.8s', status: 'Překročeno' }
      ],
      aiFix: 'Vytvořen auto-patch s std::unique_ptr & bounds check sanitizací.',
      bounty: '0.005 ETH / AI Auto-Merge'
    },
    'go-concurrency': {
      prName: 'PR #189 (Go API Gateway)',
      vuln: 'Data Race v session_store.go & Potenciální SQL Injection v query_builder.go',
      scanTime: '24 ms',
      astNodes: '8,410 nodes scanned',
      spotBids: [
        { provider: 'Hetzner Cloud Spot (nbg1)', cost: '$0.021', time: '0.9s', status: 'WYGRAŁ (Nejrychlejší)' },
        { provider: 'AWS Spot (t4g.medium)', cost: '$0.035', time: '1.1s', status: 'Překročeno' }
      ],
      aiFix: 'Parametrizován SQL dotaz + přidán sync.RWMutex do struktury SessionStore.',
      bounty: '0.002 SOL / Verified'
    },
    'py-security': {
      prName: 'PR #312 (Python Data Pipeline)',
      vuln: 'Unsanitized eval() input in data_loader.py:42',
      scanTime: '18 ms',
      astNodes: '5,120 nodes scanned',
      spotBids: [
        { provider: 'Oracle OCI Spot (prg-1)', cost: '$0.015', time: '0.6s', status: 'WYGRAŁ' }
      ],
      aiFix: 'Nahrazeno ast.literal_eval() pro bezpečné zpracování dat.',
      bounty: 'Auto-Fix Ready'
    }
  };

  btnRun.addEventListener('click', () => {
    const key = selectPR.value;
    const data = scenarios[key];

    terminal.innerHTML = '';
    appendTerminalLine(`> @budgetscan audit --auction-mode --pr=${data.prName}`, 'prompt');

    setTimeout(() => {
      appendTerminalLine(`[1/4] 🔍 Inicielizace Tree-sitter AST Skenování... (${data.astNodes})`, 'info');
    }, 300);

    setTimeout(() => {
      appendTerminalLine(`[2/4] ⚠️  DETEKOVÁNA ZRANITELNOST: ${data.vuln} (Čas skenování: ${data.scanTime})`, 'danger');
    }, 700);

    setTimeout(() => {
      appendTerminalLine(`[3/4] 🏆 Otevřena reverzní aukce výpočetního výkonu pro hloubkovou analýzu:`, 'warning');
      data.spotBids.forEach(bid => {
        appendTerminalLine(`   • ${bid.provider} -> ${bid.cost} (Čas: ${bid.time}) [${bid.status}]`, bid.status.includes('WYGRAŁ') ? 'success' : 'prompt');
      });
    }, 1200);

    setTimeout(() => {
      appendTerminalLine(`[4/4] ⚡ AUKČNÍ NÁVRH OPRAVY: ${data.aiFix}`, 'success');
      appendTerminalLine(`   👉 Mikrobounty alokováno: ${data.bounty}. Připraveno k automatickému schválení u PR/MR.`, 'info');
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
