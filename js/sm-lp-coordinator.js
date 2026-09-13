// ============================================================================
// RailOptAI — Station Master ↔ Loco Pilot Live Coordination Module
// Smart India Hackathon 2026 — Indian Railways Intelligent Operations Platform
// Handles Form T/409 (Caution Orders), Cab DMI Telemetry, and Driver Acknowledgment
// ============================================================================

const SM_LP_COORDINATOR = {
  activeStation: 'GGN',
  selectedTrainNumber: '12015',
  activeViewMode: 'sm-desk', // 'sm-desk' | 'driver-cab' | 'audit-log'
  cautionOrders: [],
  pollingTimer: null,
  audioContext: null,

  stationsList: [
    {
      code: 'GGN',
      name: 'Gurugram Junction (Delhi Div / NR)',
      shortName: 'Gurugram Jn (GGN)',
      line: 'Rewari–Delhi Main Corridor',
      panelType: 'Electronic Interlocking (EI)',
      dutyStationMaster: 'Shri Satish K. Sharma',
      designation: 'Station Superintendent (SS) / SM',
      empId: 'NR-DLI-SM-4011',
      shift: '08:00 — 16:00 hrs (Day General Shift)',
      cugMobile: '+91 97176 38401',
      rlyAutoPhone: '030-22441',
      rlyControlExt: '441',
      controlHotline: 'Magneto Hotline DL-14 (Delhi Operations Control Desk)',
      vhfChannel: '150.150 MHz Simplex (Callsign: GGN-SM-MAIN)',
      panelLocation: 'Platform 1, Relay Interlocking Building, Room 102',
      stationEmail: 'sm.ggn@nr.railnet.gov.in',
      bsnlLandline: '0124-2321450'
    },
    {
      code: 'GHH',
      name: 'Garhi Harsaru Junction (Delhi Div / NR)',
      shortName: 'Garhi Harsaru (GHH)',
      line: 'Rewari–Delhi Main Corridor',
      panelType: 'Route Relay Interlocking (RRI)',
      dutyStationMaster: 'Shri D.P. Rao',
      designation: 'Station Superintendent (SS) / SM',
      empId: 'NR-DLI-SM-4018',
      shift: '08:00 — 16:00 hrs (Day General Shift)',
      cugMobile: '+91 97176 38408',
      rlyAutoPhone: '030-22448',
      rlyControlExt: '448',
      controlHotline: 'Magneto Hotline DL-15 (Delhi Section Control)',
      vhfChannel: '150.150 MHz Simplex (Callsign: GHH-SM-DESK)',
      panelLocation: 'Platform 1, RRI Panel Room',
      stationEmail: 'sm.ghh@nr.railnet.gov.in',
      bsnlLandline: '0124-2278110'
    },
    {
      code: 'PTRD',
      name: 'Pataudi Road (Delhi Div / NR)',
      shortName: 'Pataudi Road (PTRD)',
      line: 'Rewari–Delhi Main Corridor',
      panelType: 'Solid State Interlocking (SSI)',
      dutyStationMaster: 'Shri Vinod Yadav',
      designation: 'Station Master (SM / Level 3)',
      empId: 'NR-DLI-SM-4022',
      shift: '16:00 — 00:00 hrs (Evening Shift)',
      cugMobile: '+91 97176 38412',
      rlyAutoPhone: '030-22452',
      rlyControlExt: '452',
      controlHotline: 'Magneto Hotline DL-16',
      vhfChannel: '150.150 MHz Simplex (Callsign: PTRD-SM-CABIN)',
      panelLocation: 'Main Building, Station Master Panel Room',
      stationEmail: 'sm.ptrd@nr.railnet.gov.in',
      bsnlLandline: '0124-2672300'
    },
    {
      code: 'RE',
      name: 'Rewari Junction (Jaipur/Delhi Div)',
      shortName: 'Rewari Junction (RE)',
      line: 'Junction Apex Hub (NR/NWR Interchange)',
      panelType: 'Electronic Interlocking (EI)',
      dutyStationMaster: 'Shri Jagdish Prasad',
      designation: 'Chief Station Manager (CSM) / SM',
      empId: 'NR-DLI-CSM-4001',
      shift: '08:00 — 16:00 hrs (Day General Shift)',
      cugMobile: '+91 97176 38350',
      rlyAutoPhone: '030-22350 / 030-22351',
      rlyControlExt: '350',
      controlHotline: 'Magneto Hotline RE-01 (Apex Divisional Desk)',
      vhfChannel: '150.150 MHz Simplex (Callsign: RE-APEX-CONTROL)',
      panelLocation: 'Central Electronic Interlocking Tower, Level 2',
      stationEmail: 'csm.re@nr.railnet.gov.in',
      bsnlLandline: '01274-254100'
    },
    {
      code: 'UMB',
      name: 'Ambala Cantt (Ambala Div / NR)',
      shortName: 'Ambala Cantt (UMB)',
      line: 'Main Trunk Route (Delhi–Amritsar / Kalka)',
      panelType: 'Centralized Electronic Panel (EI)',
      dutyStationMaster: 'Shri Rajiv Mohan',
      designation: 'Chief Station Director (CSD) / SM',
      empId: 'NR-UMB-CSM-3001',
      shift: '08:00 — 16:00 hrs (Day General Shift)',
      cugMobile: '+91 97295 38201',
      rlyAutoPhone: '032-21201',
      rlyControlExt: '201',
      controlHotline: 'Magneto Hotline UMB-02 (Ambala Operations Desk)',
      vhfChannel: '150.150 MHz Simplex (Callsign: UMB-MAIN-DESK)',
      panelLocation: 'Platform 1, Operations Directorate Block',
      stationEmail: 'sm.umb@nr.railnet.gov.in',
      bsnlLandline: '0171-2640200'
    },
    {
      code: 'SIR',
      name: 'Sirhind Junction (Ambala Div / NR)',
      shortName: 'Sirhind Junction (SIR)',
      line: 'Ludhiana Corridor (Northern Railway)',
      panelType: 'Electronic Interlocking (EI)',
      dutyStationMaster: 'Shri Balwinder Singh',
      designation: 'Station Superintendent (SS) / SM',
      empId: 'NR-UMB-SM-3014',
      shift: '16:00 — 00:00 hrs (Evening Shift)',
      cugMobile: '+91 97295 38214',
      rlyAutoPhone: '032-21214',
      rlyControlExt: '214',
      controlHotline: 'Magneto Hotline UMB-05',
      vhfChannel: '150.150 MHz Simplex (Callsign: SIR-SM-DESK)',
      panelLocation: 'EI Panel Building, Platform 1',
      stationEmail: 'sm.sir@nr.railnet.gov.in',
      bsnlLandline: '01763-222120'
    }
  ],

  trainsDb: {
    '12015': {
      number: '12015',
      name: 'Ajmer Shatabdi Express',
      type: 'Shatabdi',
      loco: 'WAP-7 #30245 (Tughlakabad TKD Shed)',
      locoPilot: 'Shri Rajesh Kumar (LP / Level 4)',
      alp: 'Shri Amit Verma (ALP)',
      currentSpeed: 96,
      normalSpeed: 110,
      currentStation: 'Gurugram (GGN)',
      nextStation: 'Garhi Harsaru (GHH)',
      distToDefectKm: 14.2,
      direction: 'DOWN',
      section: 'RE-GGN (Down Line)'
    },
    '12916': {
      number: '12916',
      name: 'Ashram Superfast Express',
      type: 'Superfast',
      loco: 'WAP-7 #30412 (Vadodara BRC Shed)',
      locoPilot: 'Shri Suresh Meena (LP / Level 4)',
      alp: 'Shri R.P. Yadav (ALP)',
      currentSpeed: 88,
      normalSpeed: 120,
      currentStation: 'Garhi Harsaru (GHH)',
      nextStation: 'Pataudi Road (PTRD)',
      distToDefectKm: 8.6,
      direction: 'UP',
      section: 'RE-GGN (Up Main Line)'
    },
    '22452': {
      number: '22452',
      name: 'Chandigarh – BDTS Superfast',
      type: 'Superfast',
      loco: 'WAP-5 #30008 (Ghaziabad GZB Shed)',
      locoPilot: 'Shri V.K. Singh (LP)',
      alp: 'Shri Manoj Sharma (ALP)',
      currentSpeed: 102,
      normalSpeed: 130,
      currentStation: 'Delhi Cantt (DEC)',
      nextStation: 'Gurugram (GGN)',
      distToDefectKm: 28.4,
      direction: 'DOWN',
      section: 'RE-GGN'
    },
    '12414': {
      number: '12414',
      name: 'Jammu Tawi – Ajmer Pooja SF',
      type: 'Superfast',
      loco: 'WAP-7 #30310 (TKD Shed)',
      locoPilot: 'Shri H.P. Meena (LP)',
      alp: 'Shri Dinesh Kumar (ALP)',
      currentSpeed: 74,
      normalSpeed: 110,
      currentStation: 'Palam (PM)',
      nextStation: 'Delhi Cantt (DEC)',
      distToDefectKm: 34.0,
      direction: 'DOWN',
      section: 'RE-GGN'
    }
  },

  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this.bindEvents();
    this.fetchOrders();
    this.startLiveSync();
  },

  bindEvents() {
    // Station dropdown change
    const stationSelect = document.getElementById('smStationSelector');
    if (stationSelect) {
      stationSelect.addEventListener('change', (e) => {
        this.activeStation = e.target.value;
        this.renderStationDesk();
      });
    }

    // Train selection change on SM console
    const trainSelect = document.getElementById('smTargetTrain');
    if (trainSelect) {
      trainSelect.addEventListener('change', (e) => {
        this.selectedTrainNumber = e.target.value;
        this.syncTrainFormDetails();
        this.renderLocoPilotCab();
      });
    }

    // View Mode switch buttons
    const viewButtons = document.querySelectorAll('.sm-view-toggle-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.viewMode;
        if (mode) {
          this.switchViewMode(mode);
        }
      });
    });

    // Form T/409 submit
    const dispatchForm = document.getElementById('formT409Dispatch');
    if (dispatchForm) {
      dispatchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleDispatchCautionOrder();
      });
    }

    // VHF Audio Broadcast Button
    const vhfBtn = document.getElementById('smVhfBroadcastBtn');
    if (vhfBtn) {
      vhfBtn.addEventListener('click', () => {
        this.playVhfTransmission();
      });
    }

    // Pre-fill from current track problem
    const prefillBtn = document.getElementById('smPrefillDefectBtn');
    if (prefillBtn) {
      prefillBtn.addEventListener('click', () => {
        this.prefillWithCorridorDefect();
      });
    }
  },

  // ── Switch Tabs / Views ───────────────────────────────────────────────────
  switchViewMode(mode) {
    this.activeViewMode = mode;
    
    // Update button states
    document.querySelectorAll('.sm-view-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.viewMode === mode);
    });

    // Toggle panels
    const smPanel = document.getElementById('smDeskPanel');
    const cabPanel = document.getElementById('locoPilotCabPanel');
    const auditPanel = document.getElementById('crsAuditPanel');

    if (smPanel) smPanel.style.display = mode === 'sm-desk' ? 'block' : 'none';
    if (cabPanel) {
      cabPanel.style.display = mode === 'driver-cab' ? 'block' : 'none';
      if (mode === 'driver-cab') {
        this.renderLocoPilotCab();
      }
    }
    if (auditPanel) auditPanel.style.display = mode === 'audit-log' ? 'block' : 'none';
  },

  // ── Audio Alert Synthesis for Loco Pilot Cab ────────────────────────────────
  playCabAlertChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      
      // Dual-tone high visibility alert (Kavach / TCAS cab sound)
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.setValueAtTime(1174.66, now + 0.15); // D6
      osc1.frequency.setValueAtTime(880, now + 0.30);
      osc1.frequency.setValueAtTime(1174.66, now + 0.45);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(587.33, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
    } catch (e) {
      console.warn('Audio chime unsupported or blocked by browser policy:', e);
    }
  },

  playVhfTransmission() {
    this.playCabAlertChime();
    const targetTrain = this.trainsDb[this.selectedTrainNumber] || this.trainsDb['12015'];
    const vhfOutput = document.getElementById('smVhfTranscriptLog');
    
    if (vhfOutput) {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
      const message = `
        <div class="vhf-log-item">
          <div class="vhf-meta"><span class="vhf-badge">150.150 MHz SIMPLEX</span> <span class="vhf-time">${nowTime}</span></div>
          <div class="vhf-speaker">🎙️ <strong>SM ${this.activeStation} (Station Master)</strong>:</div>
          <div class="vhf-text">"SM ${this.activeStation} calling Loco Pilot of Train ${targetTrain.number} (${targetTrain.name}), Loco ${targetTrain.loco}. Down line possessive block active at Km 54/8. Caution Order T/409 transmitted to your cab DMI. Restrict speed to 30 kmph on approach. Over."</div>
          <div class="vhf-speaker" style="margin-top: 6px; color: var(--accent-cyan, #0284c7);">🚆 <strong>Loco Pilot ${targetTrain.locoPilot}</strong>:</div>
          <div class="vhf-text">"Train ${targetTrain.number} acknowledging SM ${this.activeStation}. Received T/409 for Km 54/2 – 54/8. Speed target 30 kmph acknowledged on Kavach panel. Out."</div>
        </div>
      `;
      vhfOutput.innerHTML = message + vhfOutput.innerHTML;
    }

    if (window.showToast) {
      window.showToast(`📻 VHF Radio Callout transmitted to Train ${targetTrain.number} on 150.150 MHz!`, 'info');
    }
  },

  // ── Fetch & Sync Orders ─────────────────────────────────────────────────────
  async fetchOrders() {
    try {
      const res = await fetch('/api/caution-orders');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.cautionOrders = json.data;
          this.renderStationDesk();
          this.renderLocoPilotCab();
          this.renderAuditLedger();
        }
      }
    } catch (err) {
      console.warn('Error fetching caution orders:', err);
    }
  },

  startLiveSync() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = setInterval(() => {
      this.fetchOrders();
    }, 10000);
  },

  // ── Pre-fill Form with Current Corridor Problem ─────────────────────────────
  prefillWithCorridorDefect(defectData) {
    const milepostStart = document.getElementById('t409MilepostStart');
    const milepostEnd = document.getElementById('t409MilepostEnd');
    const speedInput = document.getElementById('t409SpeedLimit');
    const causeInput = document.getElementById('t409Cause');
    const sectionInput = document.getElementById('t409Section');
    const instructionsInput = document.getElementById('t409Instructions');

    if (milepostStart) milepostStart.value = (defectData && defectData.start) || 'Km 54/2';
    if (milepostEnd) milepostEnd.value = (defectData && defectData.end) || 'Km 54/8';
    if (speedInput) speedInput.value = (defectData && defectData.speed) || '30';
    if (sectionInput) sectionInput.value = 'Rewari – Gurugram (Down Line)';
    if (causeInput) causeInput.value = 'Ultrasonic Flaw MT-1042 — Emergency Joggled Fishplates & Track Tamping Block';
    if (instructionsInput) instructionsInput.value = 'Whistle continuously on approach. Strictly limit speed to 30 km/h. Be prepared to halt if red hand signal is displayed at Km 54/5.';

    if (window.showToast) {
      window.showToast('📋 Auto-filled Form T/409 with Corridor Defect MT-1042 details!', 'info');
    }
  },

  syncTrainFormDetails() {
    const targetTrain = this.trainsDb[this.selectedTrainNumber] || this.trainsDb['12015'];
    const lpDisplay = document.getElementById('smSelectedLpInfo');
    if (lpDisplay) {
      lpDisplay.innerHTML = `
        <div class="sm-train-brief">
          <div><strong>Train:</strong> ${targetTrain.number} - ${targetTrain.name}</div>
          <div><strong>Loco & Crew:</strong> ${targetTrain.loco} | ${targetTrain.locoPilot}</div>
          <div><strong>Position:</strong> Approaching ${targetTrain.nextStation} (Speed: ${targetTrain.currentSpeed} km/h, Dist to Defect: ${targetTrain.distToDefectKm} km)</div>
        </div>
      `;
    }
  },

  // ── Station Master Desk Rendering ───────────────────────────────────────────
  renderStationDesk() {
    const stationObj = this.stationsList.find(s => s.code === this.activeStation) || this.stationsList[0];
    
    // Update Station Details Badge & Contact Bar
    const stnBadge = document.getElementById('smCurrentStationBadge');
    if (stnBadge) {
      stnBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span>📍 <strong>${stationObj.name}</strong></span>
          <span class="badge badge-info">${stationObj.panelType}</span>
          <span style="font-size: 12px; color: #1e3a8a; background: #dbeafe; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
            👨‍✈️ Duty SM: ${stationObj.dutyStationMaster} (${stationObj.designation.split('/')[0]})
          </span>
          <span style="font-size: 12px; color: #047857; background: #d1fae5; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
            📱 CUG: ${stationObj.cugMobile}
          </span>
          <button type="button" class="btn btn-sm btn-outline-primary" style="padding: 2px 8px; font-size: 11px; font-weight: 700;" onclick="SM_LP_COORDINATOR.openSmContactModal('${stationObj.code}')">
            📞 Telecom Dossier &amp; Directory ↗
          </button>
        </div>
      `;
    }

    // Render Inbound Approaching Trains
    const container = document.getElementById('smInboundTrainsContainer');
    if (!container) return;

    let html = '';
    Object.values(this.trainsDb).forEach(train => {
      const activeOrder = this.cautionOrders.find(o => o.trainNumber === train.number);
      const isAcknowledged = activeOrder && activeOrder.status === 'ACKNOWLEDGED_BY_LP';
      const isTransmitted = activeOrder && activeOrder.status === 'TRANSMITTED_TO_CAB';
      
      let statusBadge = `<span class="badge badge-success">CLEAR ROUTE</span>`;
      if (isAcknowledged) {
        statusBadge = `<span class="badge badge-info" style="background:#0284c7;">✅ T/409 ACKNOWLEDGED (30 KM/H)</span>`;
      } else if (isTransmitted) {
        statusBadge = `<span class="badge badge-warning" style="background:#d97706; animation: pulse 1.5s infinite;">⚠️ T/409 TRANSMITTED (PENDING ACK)</span>`;
      } else if (train.distToDefectKm < 15) {
        statusBadge = `<span class="badge badge-danger">⚠️ APPROACHING BLOCK ZONE</span>`;
      }

      html += `
        <div class="sm-train-card ${this.selectedTrainNumber === train.number ? 'selected' : ''}" onclick="SM_LP_COORDINATOR.selectTrainForDispatch('${train.number}')">
          <div class="sm-train-header">
            <div>
              <span class="sm-train-no">${train.number}</span>
              <strong class="sm-train-title">${train.name}</strong>
            </div>
            ${statusBadge}
          </div>
          <div class="sm-train-meta">
            <div><strong>Loco:</strong> ${train.loco}</div>
            <div><strong>Crew:</strong> ${train.locoPilot}</div>
            <div><strong>Location:</strong> At ${train.currentStation} ➔ ${train.nextStation}</div>
            <div><strong>Live Speed:</strong> ${train.currentSpeed} km/h &nbsp;|&nbsp; <strong>Distance to Defect:</strong> ${train.distToDefectKm} km</div>
          </div>
          <div class="sm-train-actions">
            <button type="button" class="btn btn-sm btn-primary" onclick="SM_LP_COORDINATOR.selectTrainForDispatch('${train.number}')">
              📄 Prepare T/409
            </button>
            <button type="button" class="btn btn-sm btn-outline-info" onclick="SM_LP_COORDINATOR.viewDriverCab('${train.number}')">
              🚆 View Loco Cab DMI
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.syncTrainFormDetails();
  },

  selectTrainForDispatch(trainNumber) {
    this.selectedTrainNumber = trainNumber;
    const trainSelect = document.getElementById('smTargetTrain');
    if (trainSelect) trainSelect.value = trainNumber;
    this.renderStationDesk();
    if (window.showToast) {
      window.showToast(`Selected Train ${trainNumber} for Form T/409 Caution Dispatch`, 'info');
    }
  },

  viewDriverCab(trainNumber) {
    this.selectedTrainNumber = trainNumber;
    this.switchViewMode('driver-cab');
  },

  // ── Dispatch Caution Order Action ───────────────────────────────────────────
  async handleDispatchCautionOrder() {
    const targetTrain = this.trainsDb[this.selectedTrainNumber] || this.trainsDb['12015'];
    const stationObj = this.stationsList.find(s => s.code === this.activeStation) || this.stationsList[0];

    const milepostStart = document.getElementById('t409MilepostStart')?.value || 'Km 54/2';
    const milepostEnd = document.getElementById('t409MilepostEnd')?.value || 'Km 54/8';
    const speedLimit = document.getElementById('t409SpeedLimit')?.value || '30';
    const cause = document.getElementById('t409Cause')?.value || 'Emergency Maintenance Possession';
    const section = document.getElementById('t409Section')?.value || 'Rewari – Gurugram (Down Line)';
    const instructions = document.getElementById('t409Instructions')?.value || 'Whistle continuously. Strictly observe 30 km/h speed limit.';

    const payload = {
      formType: 'T/409 (Divisional Caution Order)',
      stationCode: stationObj.code,
      stationName: stationObj.name,
      trainNumber: targetTrain.number,
      trainName: targetTrain.name,
      locoNumber: targetTrain.loco,
      locoPilotName: targetTrain.locoPilot,
      alpName: targetTrain.alp,
      section: section,
      milepostStart: milepostStart,
      milepostEnd: milepostEnd,
      restrictedSpeedKmH: parseInt(speedLimit, 10),
      normalSpeedKmH: targetTrain.normalSpeed,
      cause: cause,
      specialInstructions: instructions,
      dispatchedBy: `Station Master (${stationObj.code} Panel Desk)`
    };

    try {
      const res = await fetch('/api/caution-orders/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (window.showToast) {
          window.showToast(`🚨 Caution Order ${json.data.orderId} dispatched to Train ${targetTrain.number} Cab DMI!`, 'success');
        }
        this.playCabAlertChime();
        await this.fetchOrders();
      } else {
        alert('Failed to dispatch order: ' + (json.error || 'Server error'));
      }
    } catch (err) {
      console.error('Dispatch error:', err);
      alert('Error communicating with server: ' + err.message);
    }
  },

  // ── Loco Pilot Cab DMI Rendering ────────────────────────────────────────────
  renderLocoPilotCab() {
    const targetTrain = this.trainsDb[this.selectedTrainNumber] || this.trainsDb['12015'];
    const activeOrder = this.cautionOrders.find(o => o.trainNumber === targetTrain.number);
    const currentSm = this.stationsList.find(s => s.code === this.activeStation) || this.stationsList[0];

    // Update Loco Pilot header info
    const cabHeader = document.getElementById('cabTrainHeader');
    if (cabHeader) {
      cabHeader.innerHTML = `
        <div class="cab-title-row">
          <div>
            <span class="cab-train-num">${targetTrain.number}</span>
            <span class="cab-train-name">${targetTrain.name}</span>
          </div>
          <div class="cab-loco-badge">⚡ ${targetTrain.loco}</div>
        </div>
        <div class="cab-crew-row">
          <span>👨‍✈️ <strong>Loco Pilot:</strong> ${targetTrain.locoPilot}</span>
          <span>👨‍✈️ <strong>ALP:</strong> ${targetTrain.alp}</span>
          <span>📍 <strong>Section:</strong> ${targetTrain.section}</span>
        </div>
      `;
    }

    // Cab Warning Banner & Order Card
    const banner = document.getElementById('cabAlertBanner');
    const orderDetails = document.getElementById('cabOrderDetailsContainer');
    const ackBtnContainer = document.getElementById('cabAckButtonContainer');
    const speedTargetDisplay = document.getElementById('cabTargetSpeedValue');
    const currentSpeedDisplay = document.getElementById('cabCurrentSpeedValue');
    const distanceDisplay = document.getElementById('cabDistanceCountdown');

    if (currentSpeedDisplay) currentSpeedDisplay.textContent = targetTrain.currentSpeed;
    if (distanceDisplay) distanceDisplay.textContent = `${targetTrain.distToDefectKm} KM`;

    if (activeOrder) {
      const isAck = activeOrder.status === 'ACKNOWLEDGED_BY_LP';
      
      if (speedTargetDisplay) {
        speedTargetDisplay.textContent = `${activeOrder.restrictedSpeedKmH} KM/H`;
        speedTargetDisplay.style.color = isAck ? 'var(--ir-gold, #f59e0b)' : 'var(--danger-color, #ef4444)';
      }

      if (banner) {
        if (isAck) {
          banner.className = 'cab-alert-banner ack-state';
          banner.innerHTML = `
            <div class="cab-alert-icon">✅</div>
            <div class="cab-alert-content">
              <h4>CAUTION ORDER ${activeOrder.orderId} ACTIVE & LOCKED IN KAVACH</h4>
              <p>Restricted Speed: <strong>${activeOrder.restrictedSpeedKmH} km/h</strong> between ${activeOrder.milepostStart} and ${activeOrder.milepostEnd}. Acknowledged at ${new Date(activeOrder.acknowledgedAt).toLocaleTimeString('en-IN')}.</p>
            </div>
          `;
        } else {
          banner.className = 'cab-alert-banner alert-state';
          banner.innerHTML = `
            <div class="cab-alert-icon pulse-alarm">⚠️</div>
            <div class="cab-alert-content">
              <h4>🚨 NEW CAUTION ORDER RECEIVED FROM STATION MASTER (${activeOrder.stationCode})</h4>
              <p>Immediate driver acknowledgment required. Target speed limit: <strong>${activeOrder.restrictedSpeedKmH} km/h</strong> at ${activeOrder.milepostStart}–${activeOrder.milepostEnd}.</p>
            </div>
          `;
        }
      }

      if (orderDetails) {
        orderDetails.innerHTML = `
          <!-- Driver to Station Master Direct Contact Widget -->
          <div class="cab-sm-direct-contact-bar" style="background: #1e293b; border: 1.5px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">📞</span>
              <div>
                <div style="font-size: 12px; font-weight: 800; color: #38bdf8;">DIRECT CAB HOTLINE TO STATION MASTER: ${currentSm.name}</div>
                <div style="font-size: 11.5px; color: #94a3b8;">Duty SM: <strong>${currentSm.dutyStationMaster}</strong> &nbsp;|&nbsp; CUG: <strong style="color:#34d399;">${currentSm.cugMobile}</strong> &nbsp;|&nbsp; Rly Ext: <strong>${currentSm.rlyAutoPhone}</strong> &nbsp;|&nbsp; VHF: <strong>${currentSm.vhfChannel.split(' ')[0]}</strong></div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-sm btn-primary" style="font-size: 11px; padding: 4px 10px; font-weight: 700; background: #0284c7;" onclick="SM_LP_COORDINATOR.simulateCall('CUG Mobile', '${currentSm.cugMobile}', '${currentSm.dutyStationMaster} (${currentSm.code})')">
                📱 Call CUG Mobile
              </button>
              <button type="button" class="btn btn-sm btn-outline-info" style="font-size: 11px; padding: 4px 10px; font-weight: 700;" onclick="SM_LP_COORDINATOR.openSmContactModal('${currentSm.code}')">
                🏢 Full Directory ↗
              </button>
            </div>
          </div>

          <div class="t409-official-paper">
            <div class="t409-header">
              <div class="t409-crest">INDIAN RAILWAYS / भारतीय रेल</div>
              <div class="t409-title">FORM T/409 — DIVISIONAL CAUTION ORDER</div>
              <div class="t409-ref">Memo Ref: <strong>${activeOrder.orderId}</strong> | Station: <strong>${activeOrder.stationName} (${activeOrder.stationCode})</strong></div>
            </div>
            <div class="t409-grid">
              <div class="t409-field"><span>Train No:</span> <strong>${activeOrder.trainNumber} (${activeOrder.trainName})</strong></div>
              <div class="t409-field"><span>Loco & Shed:</span> <strong>${activeOrder.locoNumber}</strong></div>
              <div class="t409-field"><span>Loco Pilot:</span> <strong>${activeOrder.locoPilotName}</strong></div>
              <div class="t409-field"><span>Assistant LP:</span> <strong>${activeOrder.alpName}</strong></div>
              <div class="t409-field"><span>Section:</span> <strong>${activeOrder.section}</strong></div>
              <div class="t409-field"><span>Speed Restriction:</span> <strong style="color:#b91c1c; font-size:16px;">${activeOrder.restrictedSpeedKmH} km/h</strong> (Normal: ${activeOrder.normalSpeedKmH} km/h)</div>
              <div class="t409-field full"><span>Location (Between Km):</span> <strong>${activeOrder.milepostStart} &nbsp;TO&nbsp; ${activeOrder.milepostEnd}</strong></div>
              <div class="t409-field full"><span>Cause of Restriction:</span> <strong>${activeOrder.cause}</strong></div>
              <div class="t409-field full"><span>Special Working Instructions:</span> <em>${activeOrder.specialInstructions}</em></div>
              <div class="t409-field full"><span>Dispatched By:</span> <strong>${activeOrder.dispatchedBy}</strong> at ${new Date(activeOrder.dispatchedAt).toLocaleString('en-IN')}</div>
            </div>
          </div>
        `;
      }

      if (ackBtnContainer) {
        if (isAck) {
          ackBtnContainer.innerHTML = `
            <div class="cab-ack-badge">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Digitally Signed & Acknowledged by LP ${activeOrder.locoPilotName} (CRS Standard Compliance Met)</span>
            </div>
          `;
        } else {
          ackBtnContainer.innerHTML = `
            <button type="button" class="btn btn-lg btn-danger btn-ack-caution" onclick="SM_LP_COORDINATOR.acknowledgeOrder('${activeOrder.orderId}')">
              ✍️ ACKNOWLEDGE & APPLY ${activeOrder.restrictedSpeedKmH} KM/H TARGET (LP ${targetTrain.locoPilot})
            </button>
          `;
        }
      }

    } else {
      if (speedTargetDisplay) speedTargetDisplay.textContent = `${targetTrain.normalSpeed} KM/H`;
      if (banner) {
        banner.className = 'cab-alert-banner normal-state';
        banner.innerHTML = `
          <div class="cab-alert-icon">🟢</div>
          <div class="cab-alert-content">
            <h4>CAB DMI TELEMETRY — NORMAL LINE CLEAR</h4>
            <p>No active speed restrictions dispatched for Train ${targetTrain.number} on current block section.</p>
          </div>
        `;
      }
      if (orderDetails) {
        orderDetails.innerHTML = `
          <!-- Driver to Station Master Direct Contact Widget -->
          <div class="cab-sm-direct-contact-bar" style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">📞</span>
              <div>
                <div style="font-size: 12px; font-weight: 800; color: #38bdf8;">DIRECT CAB HOTLINE TO STATION MASTER: ${currentSm.name}</div>
                <div style="font-size: 11.5px; color: #94a3b8;">Duty SM: <strong>${currentSm.dutyStationMaster}</strong> &nbsp;|&nbsp; CUG: <strong style="color:#34d399;">${currentSm.cugMobile}</strong> &nbsp;|&nbsp; Rly Ext: <strong>${currentSm.rlyAutoPhone}</strong> &nbsp;|&nbsp; VHF: <strong>${currentSm.vhfChannel.split(' ')[0]}</strong></div>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-sm btn-primary" style="font-size: 11px; padding: 4px 10px; font-weight: 700; background: #0284c7;" onclick="SM_LP_COORDINATOR.simulateCall('CUG Mobile', '${currentSm.cugMobile}', '${currentSm.dutyStationMaster} (${currentSm.code})')">
                📱 Call CUG Mobile
              </button>
              <button type="button" class="btn btn-sm btn-outline-info" style="font-size: 11px; padding: 4px 10px; font-weight: 700;" onclick="SM_LP_COORDINATOR.openSmContactModal('${currentSm.code}')">
                🏢 Full Directory ↗
              </button>
            </div>
          </div>
          <div class="empty-state"><p>No active Form T/409 caution orders for Train ${targetTrain.number}.</p></div>
        `;
      }

      if (ackBtnContainer) {
        if (isAck) {
          ackBtnContainer.innerHTML = `
            <div class="cab-ack-badge">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Digitally Signed & Acknowledged by LP ${activeOrder.locoPilotName} (CRS Standard Compliance Met)</span>
            </div>
          `;
        } else {
          ackBtnContainer.innerHTML = `
            <button type="button" class="btn btn-lg btn-danger btn-ack-caution" onclick="SM_LP_COORDINATOR.acknowledgeOrder('${activeOrder.orderId}')">
              ✍️ ACKNOWLEDGE & APPLY ${activeOrder.restrictedSpeedKmH} KM/H TARGET (LP ${targetTrain.locoPilot})
            </button>
          `;
        }
      }

    } else {
      if (speedTargetDisplay) speedTargetDisplay.textContent = `${targetTrain.normalSpeed} KM/H`;
      if (banner) {
        banner.className = 'cab-alert-banner normal-state';
        banner.innerHTML = `
          <div class="cab-alert-icon">🟢</div>
          <div class="cab-alert-content">
            <h4>CAB DMI TELEMETRY — NORMAL LINE CLEAR</h4>
            <p>No active speed restrictions dispatched for Train ${targetTrain.number} on current block section.</p>
          </div>
        `;
      }
      if (orderDetails) {
        orderDetails.innerHTML = `<div class="empty-state"><p>No active Form T/409 caution orders for Train ${targetTrain.number}.</p></div>`;
      }
      if (ackBtnContainer) ackBtnContainer.innerHTML = '';
    }
  },

  // ── Acknowledge Order from Loco Cab ─────────────────────────────────────────
  async acknowledgeOrder(orderId) {
    const targetTrain = this.trainsDb[this.selectedTrainNumber] || this.trainsDb['12015'];
    try {
      const res = await fetch('/api/caution-orders/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          locoPilotName: targetTrain.locoPilot
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (window.showToast) {
          window.showToast(`✅ Caution Order ${orderId} legally acknowledged by Loco Pilot!`, 'success');
        }
        await this.fetchOrders();
      } else {
        alert('Error acknowledging order: ' + (json.error || 'Server error'));
      }
    } catch (err) {
      console.error('Ack error:', err);
      alert('Failed to submit acknowledgment: ' + err.message);
    }
  },

  // ── Digital CRS Audit Ledger ────────────────────────────────────────────────
  renderAuditLedger() {
    const container = document.getElementById('crsAuditTableBody');
    if (!container) return;

    if (this.cautionOrders.length === 0) {
      container.innerHTML = `<tr><td colspan="7" class="text-center">No caution orders recorded in session.</td></tr>`;
      return;
    }

    let html = '';
    this.cautionOrders.forEach(o => {
      const isAck = o.status === 'ACKNOWLEDGED_BY_LP';
      const statusBadge = isAck 
        ? `<span class="badge badge-success">ACKNOWLEDGED (CRS MET)</span>`
        : `<span class="badge badge-warning">TRANSMITTED (PENDING ACK)</span>`;

      html += `
        <tr>
          <td><code>${o.orderId}</code></td>
          <td><strong>${o.trainNumber}</strong> (${o.trainName})<br><small>${o.locoNumber}</small></td>
          <td>${o.stationCode} (${o.stationName})</td>
          <td><strong style="color:var(--danger-color, #ef4444);">${o.restrictedSpeedKmH} km/h</strong><br><small>${o.milepostStart}–${o.milepostEnd}</small></td>
          <td>${new Date(o.dispatchedAt).toLocaleTimeString('en-IN')}</td>
          <td>${o.acknowledgedAt ? new Date(o.acknowledgedAt).toLocaleTimeString('en-IN') : '—'}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });

    container.innerHTML = html;
  },

  // ── Station Master Official Contact Modal & Telecom Directory ───────────────
  openSmContactModal(targetCode) {
    const stationCode = (targetCode || this.activeStation || 'GGN').toUpperCase();
    const station = this.stationsList.find(s => s.code === stationCode) || this.stationsList[0];
    const modal = document.getElementById('smContactDirectoryModal');
    const content = document.getElementById('smContactModalContent');

    if (!modal || !content) return;

    // Generate Directory rows for all stations
    let dirRows = '';
    this.stationsList.forEach(s => {
      const isCurrent = s.code === station.code;
      dirRows += `
        <tr style="${isCurrent ? 'background:#ecfdf5; font-weight:600;' : ''}">
          <td><strong>${s.code}</strong> — ${s.shortName} ${isCurrent ? '<span class="badge badge-success" style="font-size:9px;">ACTIVE</span>' : ''}</td>
          <td>${s.dutyStationMaster}<br><small style="color:var(--text-muted);">${s.designation}</small></td>
          <td>
            <a href="tel:${s.cugMobile.replace(/[^0-9+]/g, '')}" style="color:#0284c7; font-weight:700; text-decoration:none;">${s.cugMobile}</a>
            <button type="button" class="btn-copy-mini" onclick="SM_LP_COORDINATOR.copyToClipboard('${s.cugMobile}', 'CUG Number')">📋</button>
          </td>
          <td><code>${s.rlyAutoPhone}</code> (Ext: ${s.rlyControlExt})</td>
          <td><span style="font-size:11px; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">${s.vhfChannel.split(' ')[0]}</span></td>
          <td>
            <button type="button" class="btn btn-sm btn-primary" style="padding:2px 8px; font-size:11px;" onclick="SM_LP_COORDINATOR.selectStationAndOpenDesk('${s.code}')">
              Select Station
            </button>
          </td>
        </tr>
      `;
    });

    content.innerHTML = `
      <!-- Featured Station Contact Dossier -->
      <div class="sm-dossier-card" style="background: linear-gradient(135deg, #0b192c 0%, #1e3e62 100%); color: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(11,25,44,0.25);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 14px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #38bdf8; letter-spacing: 1px; text-transform: uppercase;">INDIAN RAILWAYS • OPERATIONAL TELECOM DOSSIER</div>
            <h3 style="margin: 4px 0; font-size: 20px; color: #ffffff;">${station.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">${station.line} • Interlocking: <strong>${station.panelType}</strong></p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: #cbd5e1;">Active Duty Shift:</div>
            <div style="font-size: 13px; font-weight: 700; color: #facc15;">${station.shift}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
          
          <!-- Duty Officer Info -->
          <div style="background: rgba(255,255,255,0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Duty Station Master / Superintendent</div>
            <div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 2px;">${station.dutyStationMaster}</div>
            <div style="font-size: 12px; color: #38bdf8;">${station.designation} (Emp ID: <code>${station.empId}</code>)</div>
            <div style="font-size: 11.5px; color: #cbd5e1; margin-top: 6px;">📍 ${station.panelLocation}</div>
          </div>

          <!-- Quick Connect Buttons -->
          <div style="background: rgba(255,255,255,0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: center; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: #cbd5e1;">📱 Railway CUG Mobile:</span>
              <strong style="color: #34d399; font-size: 14px;">${station.cugMobile}</strong>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: #cbd5e1;">☎️ Railway Auto Ext:</span>
              <strong style="color: #ffffff; font-size: 13px;">${station.rlyAutoPhone} (Ext: ${station.rlyControlExt})</strong>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: #cbd5e1;">📻 VHF Simplex:</span>
              <strong style="color: #67e8f9; font-size: 12px;">${station.vhfChannel}</strong>
            </div>
          </div>

        </div>

        <!-- Direct Actions -->
        <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-success" style="background: #059669; border-color: #059669; font-weight: 700;" onclick="SM_LP_COORDINATOR.simulateCall('CUG Mobile', '${station.cugMobile}', '${station.dutyStationMaster} (${station.code})')">
            📞 Dial CUG Mobile (${station.cugMobile})
          </button>
          <button type="button" class="btn btn-sm btn-info" style="background: #0284c7; border-color: #0284c7; font-weight: 700;" onclick="SM_LP_COORDINATOR.simulateCall('Railway Auto Intercom', '${station.rlyAutoPhone}', '${station.dutyStationMaster} (${station.code})')">
            ☎️ Dial Railway Auto Line (${station.rlyAutoPhone})
          </button>
          <button type="button" class="btn btn-sm btn-secondary" onclick="SM_LP_COORDINATOR.copyToClipboard('${station.dutyStationMaster} - ${station.name}\\nCUG: ${station.cugMobile}\\nRly Auto: ${station.rlyAutoPhone}\\nHotline: ${station.controlHotline}', 'Station Master Dossier')">
            📋 Copy Full Contact Dossier
          </button>
        </div>
      </div>

      <!-- Divisional Station Directory Matrix -->
      <div style="margin-top: 20px;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: var(--ir-navy); display: flex; align-items: center; gap: 6px;">
          <span>📖 Northern Railway — Delhi &amp; Ambala Division Station Master Directory</span>
        </h4>
        <div class="table-container" style="max-height: 260px; overflow-y: auto;">
          <table class="data-table" style="width: 100%; font-size: 12px;">
            <thead>
              <tr>
                <th>Station Code &amp; Name</th>
                <th>Duty Station Master</th>
                <th>CUG Mobile</th>
                <th>Railway Auto Phone</th>
                <th>VHF Frequency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${dirRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  closeSmContactModal() {
    const modal = document.getElementById('smContactDirectoryModal');
    if (modal) modal.classList.remove('active');
  },

  selectStationAndOpenDesk(stationCode) {
    this.activeStation = stationCode;
    const stationSelect = document.getElementById('smStationSelector');
    if (stationSelect) stationSelect.value = stationCode;
    this.renderStationDesk();
    this.closeSmContactModal();
    if (window.showToast) {
      window.showToast(`Switched active desk to Station ${stationCode}`, 'info');
    }
  },

  simulateCall(callType, number, targetName) {
    this.playCabAlertChime();
    if (window.showToast) {
      window.showToast(`📞 Connecting ${callType} to ${targetName} (${number})... [Simulated RailTel Link Active]`, 'success');
    }
  },

  copyToClipboard(text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast(`📋 Copied ${label} to clipboard!`, 'info');
      }).catch(() => {
        prompt('Copy contact information:', text);
      });
    } else {
      prompt('Copy contact information:', text);
    }
  }
};

// Global initialization on DOM ready
if (typeof window !== 'undefined') {
  window.SM_LP_COORDINATOR = SM_LP_COORDINATOR;
  document.addEventListener('DOMContentLoaded', () => {
    SM_LP_COORDINATOR.init();
  });
}

