/* ═══════════════════════════════════════════════
   PHISHGUARD — SECURITY AWARENESS TRAINING
   External JavaScript
   ═══════════════════════════════════════════════ */

"use strict";

// ─── QUIZ DATA ─────────────────────────────────────────────────────────────
const QUIZ_DATA = [
  {
    q: "You receive an email from 'support@paypa1.com' asking you to verify your PayPal account. What should you do?",
    options: [
      "Click the link and log in to check what's wrong",
      "Reply to the email asking for more details",
      "Do not click any link — go directly to paypal.com by typing it in your browser",
      "Forward it to your friends to warn them"
    ],
    correct: 2,
    explanation: "Always navigate directly to websites by typing the URL. The domain 'paypa1.com' uses the number '1' to mimic the letter 'l' — a classic typosquatting trick."
  },
  {
    q: "Which of these is a strong indicator that a website may be fake or malicious?",
    options: [
      "The website has a green padlock in the address bar",
      "The URL is 'https://secure-bankofamerica.login-verify.ru'",
      "The website asks you to create an account",
      "The website has a privacy policy page"
    ],
    correct: 1,
    explanation: "Legitimate banks never use third-party domains. 'login-verify.ru' is the actual domain here, not Bank of America. A padlock only means the connection is encrypted, NOT that the site is trustworthy."
  },
  {
    q: "Your CEO sends you an urgent WhatsApp message asking you to buy $500 in gift cards and send the codes immediately for a surprise employee event. This is most likely…",
    options: [
      "A legitimate request — your CEO is known to be spontaneous",
      "A CEO fraud / Business Email Compromise (BEC) attack",
      "A phishing attack via email",
      "A smishing (SMS phishing) attack"
    ],
    correct: 1,
    explanation: "Gift card requests via messaging apps claiming to be executives are a hallmark of CEO fraud / BEC attacks. Always verify unusual financial requests through an official channel (call their known work phone)."
  },
  {
    q: "What does 'Multi-Factor Authentication (MFA)' protect you from even if your password is phished?",
    options: [
      "It encrypts your password so it can't be stolen",
      "It requires a second verification factor (like a phone code) that the attacker doesn't have",
      "It automatically blocks all phishing emails",
      "It prevents your device from being infected with malware"
    ],
    correct: 1,
    explanation: "MFA means an attacker who steals your password still can't log in without your second factor (phone, hardware key). This single measure blocks the vast majority of account takeover attacks."
  },
  {
    q: "You find a USB drive in the company parking lot labeled 'Q3 Salary Review — Confidential'. What should you do?",
    options: [
      "Plug it in to find out who it belongs to so you can return it",
      "Plug it in on a company computer with antivirus enabled",
      "Hand it to IT security without plugging it in",
      "Take it home and check it on your personal computer"
    ],
    correct: 2,
    explanation: "This is a classic 'baiting' attack. Attackers deliberately leave infected USBs to exploit curiosity. Never plug in a found USB drive — hand it to IT or security immediately."
  },
  {
    q: "An email states: 'Your account will be permanently deleted in 24 hours unless you verify now.' This is designed to exploit which psychological trigger?",
    options: [
      "Greed and reward",
      "Social proof",
      "Urgency and fear",
      "Authority and trust"
    ],
    correct: 2,
    explanation: "Creating artificial deadlines and threatening consequences exploits urgency and fear, bypassing rational thinking. Legitimate services don't delete accounts via email ultimatums. Pause — verify via official channels."
  },
  {
    q: "Which email address is most likely a spear-phishing attempt targeting employees of 'Globex Corp'?",
    options: [
      "hr@globexcorp.com",
      "ceo.globexcorp@gmail.com",
      "noreply@globexcorp.com",
      "it-helpdesk@globexcorp.com"
    ],
    correct: 1,
    explanation: "Legitimate executives use company domains. 'ceo.globexcorp@gmail.com' is a personal Gmail address posing as corporate — a common spear-phishing tactic. The display name might show 'John Smith - CEO' to fool you."
  },
  {
    q: "You clicked a suspicious link and it asked for your password before you realized it was a phishing page. What should you do FIRST?",
    options: [
      "Wait and see if any suspicious activity happens",
      "Delete the suspicious email",
      "Immediately change your password for that account and enable MFA",
      "Run a full system scan with antivirus"
    ],
    correct: 2,
    explanation: "Speed matters. Immediately change your password on the real site and enable MFA. Then notify IT security, check for other compromised accounts, and run a malware scan. Waiting gives attackers time to act."
  }
];

// ─── STATE ─────────────────────────────────────────────────────────────────
const state = {
  currentSection: 0,
  totalSections: 5,
  quizAnswers: new Array(QUIZ_DATA.length).fill(null),
  quizSubmitted: false
};

// ─── DOM HELPERS ───────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ─── SECTION NAVIGATION ────────────────────────────────────────────────────
function goToSection(index) {
  index = Math.max(0, Math.min(state.totalSections - 1, parseInt(index)));

  // Hide current, show new
  $$('.section').forEach(s => s.classList.remove('active'));
  $$('.nav-btn').forEach(b => b.classList.remove('active'));

  const target = $(`sec-${index}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const navBtn = document.querySelector(`.nav-btn[data-section="${index}"]`);
  if (navBtn) navBtn.classList.add('active');

  state.currentSection = index;
  updateProgress();
  triggerReveal();

  // Build quiz on first visit
  if (index === 4 && !state.quizSubmitted) {
    renderQuiz();
  }
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────
function updateProgress() {
  const pct = Math.round((state.currentSection / (state.totalSections - 1)) * 100);
  $('globalProgress').style.width = pct + '%';
  $('progressPct').textContent = pct + '%';
}

// ─── REVEAL ANIMATION ──────────────────────────────────────────────────────
function triggerReveal() {
  setTimeout(() => {
    const cards = $$('.reveal');
    cards.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }, 100);
}

// ─── EMAIL DEMO TOOLTIPS ───────────────────────────────────────────────────
function initEmailTooltips() {
  const tooltip = $('emailTooltip');
  const triggers = $$('.suspicious');

  triggers.forEach(el => {
    el.addEventListener('mouseenter', e => {
      const tip = el.dataset.tip;
      if (!tip) return;
      tooltip.textContent = tip;
      tooltip.classList.remove('hidden');
    });

    el.addEventListener('mousemove', e => {
      const x = e.clientX + 14;
      const y = e.clientY - 10;
      tooltip.style.left = Math.min(x, window.innerWidth - 300) + 'px';
      tooltip.style.top = y + 'px';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
  });
}

// ─── URL ANALYZER ──────────────────────────────────────────────────────────
function analyzeURL(rawUrl) {
  const url = rawUrl.trim().toLowerCase();
  const findings = [];
  let riskLevel = 'safe';

  // Check for HTTP
  if (url.startsWith('http://') && !url.startsWith('https://')) {
    findings.push('Uses HTTP instead of HTTPS — connection is not encrypted');
    riskLevel = 'suspicious';
  }

  // IP address in domain
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    findings.push('IP address used instead of a domain name — very suspicious');
    riskLevel = 'danger';
  }

  // Suspicious TLDs
  const suspiciousTlds = ['.ru', '.cn', '.tk', '.pw', '.cc', '.top', '.xyz', '.gq', '.ml', '.cf'];
  const hasBadTld = suspiciousTlds.some(tld => url.includes(tld));
  if (hasBadTld) {
    findings.push('High-risk top-level domain (TLD) commonly used in phishing campaigns');
    riskLevel = 'danger';
  }

  // Typosquatting common brands
  const brands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'netflix', 'facebook', 'instagram', 'bank'];
  const typoPatterns = brands.map(b => {
    // detect character substitutions or extra chars
    return { brand: b, pattern: new RegExp(b.replace(/[aeiou]/g, '[a-z40-9]')) };
  });

  for (const { brand, pattern } of typoPatterns) {
    if (pattern.test(url) && !url.includes(`${brand}.com`) && !url.includes(`${brand}.net`) && !url.includes(`${brand}.org`)) {
      findings.push(`Possible typosquatting of "${brand}" — domain doesn't match official brand domain`);
      riskLevel = 'danger';
      break;
    }
  }

  // Excess subdomains
  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
    const parts = parsed.hostname.split('.');
    if (parts.length >= 4) {
      findings.push(`Excessive subdomains (${parsed.hostname}) — attackers use subdomains to bury the real malicious domain`);
      riskLevel = riskLevel === 'danger' ? 'danger' : 'suspicious';
    }

    // Long URL
    if (rawUrl.length > 100) {
      findings.push('Unusually long URL — may be obfuscating the real destination');
      riskLevel = riskLevel === 'danger' ? 'danger' : 'suspicious';
    }

    // Sensitive keywords in path
    const sensitiveWords = ['login', 'verify', 'secure', 'account', 'update', 'confirm', 'password', 'banking'];
    const urlPath = parsed.pathname + parsed.search;
    const foundKeyword = sensitiveWords.find(w => urlPath.includes(w));
    if (foundKeyword) {
      findings.push(`URL path contains sensitive keyword "${foundKeyword}" — often used to mimic legitimate authentication pages`);
      riskLevel = riskLevel === 'safe' ? 'suspicious' : riskLevel;
    }
  } catch (e) {
    findings.push('Malformed URL — could not be parsed correctly');
    riskLevel = 'suspicious';
  }

  // URL shorteners
  const shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly', 'short.io'];
  if (shorteners.some(s => url.includes(s))) {
    findings.push('URL shortener detected — hides the real destination; expand before clicking');
    riskLevel = riskLevel === 'safe' ? 'suspicious' : riskLevel;
  }

  if (findings.length === 0) {
    findings.push('No obvious red flags detected in URL structure');
    findings.push('Note: This is NOT a guarantee of safety — always verify the site content and context');
  }

  return { riskLevel, findings };
}

function initURLChecker() {
  const btn = $('checkUrl');
  const input = $('urlInput');
  const result = $('urlResult');

  function run() {
    const val = input.value.trim();
    if (!val) {
      input.focus();
      input.style.borderColor = 'var(--accent2)';
      setTimeout(() => input.style.borderColor = '', 1000);
      return;
    }

    const { riskLevel, findings } = analyzeURL(val);

    const icons = { safe: '✅', suspicious: '⚠️', danger: '🚨' };
    const labels = {
      safe: 'LOW RISK — No obvious phishing indicators found',
      suspicious: 'MEDIUM RISK — Suspicious characteristics detected',
      danger: 'HIGH RISK — Multiple phishing indicators detected'
    };

    result.className = `url-result ${riskLevel}`;
    result.innerHTML = `
      <div class="result-header">${icons[riskLevel]} ${labels[riskLevel]}</div>
      <ul class="result-items">
        ${findings.map(f => `<li>${f}</li>`).join('')}
      </ul>
    `;
    result.classList.remove('hidden');
  }

  btn.addEventListener('click', run);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
}

// ─── QUIZ ENGINE ───────────────────────────────────────────────────────────
function renderQuiz() {
  const container = $('quizContainer');
  if (!container) return;

  container.innerHTML = '';
  state.quizAnswers = new Array(QUIZ_DATA.length).fill(null);

  QUIZ_DATA.forEach((q, qi) => {
    const block = document.createElement('div');
    block.className = 'quiz-question-block';
    block.setAttribute('data-qi', qi);

    const keys = ['A', 'B', 'C', 'D'];

    block.innerHTML = `
      <div class="q-num">QUESTION ${qi + 1} OF ${QUIZ_DATA.length}</div>
      <div class="q-text">${q.q}</div>
      <div class="options-list">
        ${q.options.map((opt, oi) => `
          <button class="option-btn" data-qi="${qi}" data-oi="${oi}">
            <span class="opt-key">${keys[oi]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="q-explanation" id="exp-${qi}">${q.explanation}</div>
    `;

    container.appendChild(block);
  });

  // Add submit button
  const submitWrap = document.createElement('div');
  submitWrap.style.cssText = 'margin-top:1.5rem;';
  submitWrap.innerHTML = `
    <button class="cta-btn" id="submitQuiz">SUBMIT ANSWERS →</button>
    <div style="margin-top:0.75rem;font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);" id="quizHint">
      Answer all questions before submitting.
    </div>
  `;
  container.appendChild(submitWrap);

  // Attach option listeners
  $$('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.quizSubmitted) return;
      const qi = parseInt(btn.dataset.qi);
      const oi = parseInt(btn.dataset.oi);

      // Deselect others in this question
      document.querySelectorAll(`.option-btn[data-qi="${qi}"]`).forEach(b => {
        b.classList.remove('selected');
        b.style.borderColor = '';
        b.style.background = '';
        b.style.color = '';
      });

      // Select this one
      btn.style.borderColor = 'var(--accent)';
      btn.style.background = 'rgba(0,229,255,0.08)';
      btn.style.color = 'var(--accent)';
      state.quizAnswers[qi] = oi;

      // Update hint
      const answered = state.quizAnswers.filter(a => a !== null).length;
      const hint = $('quizHint');
      if (hint) {
        hint.textContent = answered < QUIZ_DATA.length
          ? `${answered} of ${QUIZ_DATA.length} questions answered.`
          : 'All questions answered — ready to submit!';
        if (answered === QUIZ_DATA.length) hint.style.color = 'var(--success)';
      }
    });
  });

  // Submit handler
  document.addEventListener('click', function handler(e) {
    if (e.target.id === 'submitQuiz') {
      submitQuiz();
      document.removeEventListener('click', handler);
    }
  });
}

function submitQuiz() {
  const unanswered = state.quizAnswers.filter(a => a === null).length;
  if (unanswered > 0) {
    const hint = $('quizHint');
    if (hint) {
      hint.textContent = `⚠ Please answer all ${QUIZ_DATA.length} questions before submitting.`;
      hint.style.color = 'var(--accent2)';
    }
    return;
  }

  state.quizSubmitted = true;
  let score = 0;
  const breakdown = [];

  QUIZ_DATA.forEach((q, qi) => {
    const userAns = state.quizAnswers[qi];
    const isCorrect = userAns === q.correct;
    if (isCorrect) score++;

    const keys = ['A', 'B', 'C', 'D'];

    // Style options
    const opts = document.querySelectorAll(`.option-btn[data-qi="${qi}"]`);
    opts.forEach((btn, oi) => {
      btn.disabled = true;
      btn.style.borderColor = '';
      btn.style.background = '';
      btn.style.color = '';
      if (oi === q.correct) btn.classList.add('correct');
      else if (oi === userAns && !isCorrect) btn.classList.add('wrong');
    });

    // Show explanation
    const exp = $(`exp-${qi}`);
    if (exp) exp.classList.add('show');

    breakdown.push({
      correct: isCorrect,
      qNum: qi + 1,
      yourAnswer: keys[userAns],
      correctAnswer: keys[q.correct]
    });
  });

  // Show result
  const pct = Math.round((score / QUIZ_DATA.length) * 100);
  const result = $('quizResult');

  let icon, label, color;
  if (pct === 100) {
    icon = '🏆'; label = 'PERFECT SCORE — SECURITY EXPERT'; color = 'var(--success)';
  } else if (pct >= 75) {
    icon = '🛡️'; label = 'STRONG AWARENESS — KEEP TRAINING'; color = 'var(--accent)';
  } else if (pct >= 50) {
    icon = '⚠️'; label = 'MODERATE RISK — REVIEW THE MATERIAL'; color = 'var(--accent3)';
  } else {
    icon = '🚨'; label = 'HIGH RISK — YOU NEED MORE TRAINING'; color = 'var(--accent2)';
  }

  $('resultIcon').textContent = icon;
  $('resultScore').textContent = `${score}/${QUIZ_DATA.length}`;
  $('resultScore').style.color = color;
  $('resultLabel').textContent = label;
  $('resultLabel').style.color = color;

  const bd = $('resultBreakdown');
  bd.innerHTML = breakdown.map(item => `
    <div class="breakdown-item ${item.correct ? 'correct-ans' : 'wrong-ans'}">
      <span>${item.correct ? '✓' : '✗'}</span>
      <span>Q${item.qNum}: ${item.correct ? 'Correct' : `Wrong (Your: ${item.yourAnswer} | Correct: ${item.correctAnswer})`}</span>
    </div>
  `).join('');

  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Retake handler
  $('retakeBtn').addEventListener('click', () => {
    state.quizSubmitted = false;
    result.classList.add('hidden');
    renderQuiz();
    $('quizContainer').scrollIntoView({ behavior: 'smooth' });
  });
}

// ─── EVENT DELEGATION ──────────────────────────────────────────────────────
document.addEventListener('click', e => {
  // Nav buttons
  const navBtn = e.target.closest('.nav-btn');
  if (navBtn) {
    goToSection(navBtn.dataset.section);
    return;
  }

  // Goto buttons (data-goto)
  const gotoBtn = e.target.closest('[data-goto]');
  if (gotoBtn) {
    goToSection(gotoBtn.dataset.goto);
    return;
  }
});

// ─── INTERSECTION OBSERVER FOR REVEALS ────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

function observeRevealElements() {
  $$('.reveal').forEach(el => observer.observe(el));
}

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  goToSection(0);
  initEmailTooltips();
  initURLChecker();
  observeRevealElements();

  // Re-observe when sections change
  const sectionObserver = new MutationObserver(() => {
    $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
  });
  sectionObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
});
