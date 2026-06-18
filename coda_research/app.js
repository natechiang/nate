/**
 * Exchange Plot Viewer
 * Loads the CSV, populates the dropdown with recording IDs derived from
 * available plot images, and shows insight + image + data table on selection.
 */

const IMAGE_BASE    = 'plot_images/ex_';
const CSV_PATH   = 'data/sperm-whale-dialogues.csv';
const INSIGHTS_PATH = 'data/insights.csv';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const selectEl      = document.getElementById('recording-select');
const statusEl      = document.getElementById('status');
const plotSection   = document.getElementById('plot-section');
const insightBox    = document.getElementById('insight-box');
const plotImage     = document.getElementById('plot-image');
const tableSection  = document.getElementById('table-section');
const tableHead     = document.querySelector('#data-table thead');
const tableBody     = document.querySelector('#data-table tbody');

// ── State ─────────────────────────────────────────────────────────────────────
let allRows    = [];   // parsed CSV rows (objects)
let csvHeaders = [];   // column names in original order
let insightMap = {};   // recording_id -> insight string

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

async function init() {
  setStatus('Loading data…');
  try {
    const [csvText, insightText] = await Promise.all([
      fetchText(CSV_PATH),
      fetchText(INSIGHTS_PATH)
    ]);

    ({ headers: csvHeaders, rows: allRows } = parseCSV(csvText));
    insightMap = parseInsights(insightText);

    const recIds = uniqueRecordingIds(allRows);
    populateDropdown(recIds);
    setStatus(`${recIds.length} recordings loaded.`);
  } catch (err) {
    setStatus('Error loading data: ' + err.message, true);
  }
}

// ── Event ─────────────────────────────────────────────────────────────────────
selectEl.addEventListener('change', function () {
  const recId = this.value;
  if (!recId) {
    plotSection.hidden = true;
    tableSection.hidden = true;
    setStatus('');
    return;
  }
  showRecording(recId);
});

// ── Core logic ────────────────────────────────────────────────────────────────
function showRecording(recId) {
  // Show insight
  const insight = insightMap[recId] || '';
  insightBox.textContent = insight;

  // Show image
  plotImage.src = IMAGE_BASE + recId + '.png';
  plotImage.alt = 'Exchange plot for ' + recId;
  plotSection.hidden = false;

  // Show table
  const rows = allRows.filter(r => r['REC'] === recId);
  renderTable(rows);
  tableSection.hidden = false;

  setStatus(rows.length + ' coda row(s) for ' + recId);
}

function renderTable(rows) {
  tableHead.innerHTML = '';
  const tr = document.createElement('tr');
  csvHeaders.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    tr.appendChild(th);
  });
  tableHead.appendChild(tr);

  tableBody.innerHTML = '';
  rows.forEach(row => {
    const tr = document.createElement('tr');
    csvHeaders.forEach(h => {
      const td = document.createElement('td');
      td.textContent = row[h] !== undefined ? row[h] : '';
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

function populateDropdown(recIds) {
  recIds.forEach(id => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = id;
    selectEl.appendChild(opt);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ' — HTTP ' + res.status);
  return res.text();
}

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  const headers = splitCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = splitCSVLine(lines[i]);
    if (vals.length === 0) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] !== undefined ? vals[idx] : ''; });
    rows.push(obj);
  }
  return { headers, rows };
}

function parseInsights(text) {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  const map = {};
  // skip header line (recording_id,insight)
  for (let i = 1; i < lines.length; i++) {
    const firstComma = lines[i].indexOf(',');
    if (firstComma === -1) continue;
    const recId  = lines[i].slice(0, firstComma).trim();
    const insight = lines[i].slice(firstComma + 1).trim().replace(/^"|"$/g, '');
    map[recId] = insight;
  }
  return map;
}

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function uniqueRecordingIds(rows) {
  const seen = new Set();
  const ids = [];
  rows.forEach(r => {
    const id = r['REC'];
    if (id && !seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  });
  return ids.sort();
}

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = isError ? 'error' : '';
}
