// ============================================================================
// RailOptAI — Production Railway Network & Real-Time Telemetry Map (Leaflet.js)
// Real RapidAPI / IRCTC Live Train Telemetry & Track Disruption Conflict Engine
// Smart India Hackathon 2026 — Indian Railways Operations Platform
// ============================================================================

const RailMap = {

  map: null,
  currentTheme: 'openrailway',
  activeTileLayer: null,
  activeOverlayLayer: null,

  activeSection: 'RE-GGN', // Default: Rewari → Gurugram
  currentData: null,
  refreshTimer: null,
  countdownInterval: null,
  trainAnimationTimer: null,
  secondsToNextRefresh: 60,

  layers: {
    infrastructure: null,
    tracks: null,
    mileposts: null,
    signals: null,
    stations: null,
    problem: null,
    trainPointers: null,
    vectors: null
  },

  activeTrainAnimations: [],
  trackCoords: [],
  activeTrackPolylines: [],

  // ── Synchronous Default Baseline Data (Ensures map works instantly offline/online) ──
  DEFAULT_DATA: {
    "RE-GGN": {
      sectionKey: "RE-GGN",
      sectionName: "Rewari → Gurugram (Northern Railway / Delhi Division)",
      zone: "NR",
      division: "Delhi",
      problemPoint: {
        id: "PROB-RE-GGN-54",
        type: "Ultrasonic Track Flaw MT-1042",
        milepost: "Km 54/8 Up Main Line (Between Garhi Harsaru & Pataudi Road)",
        lat: 28.3848,
        lng: 76.8623,
        proposedBlockWindow: "15:30 — 16:30 hrs",
        urgency: "CRITICAL",
        description: "Severe railhead micro-fissure detected by USFD trolley. Mandatory emergency joggled fishplates packing & 1-hour block possession required before express surges."
      },
      trains: [
        {
          trainNumber: "12916",
          trainName: "Ashram Superfast Express",
          type: "Superfast",
          route: "Ahmedabad (ADI) → Old Delhi (DLI)",
          direction: "UP",
          currentStation: "Garhi Harsaru",
          currentStationCode: "GHH",
          nextStation: "Pataudi Road",
          nextStationCode: "PTRD",
          delayMinutes: 12,
          status: "DELAYED +12m",
          speedKmH: 96,
          latitude: 28.4414,
          longitude: 76.9381,
          distanceToProblemKm: 14.2,
          timeToArrivalMin: 14,
          arrivalEta: "18:27",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [28.4414, 76.9381]
        },
        {
          trainNumber: "12015",
          trainName: "Ajmer Shatabdi Express",
          type: "Shatabdi",
          route: "New Delhi (NDLS) → Ajmer (AII)",
          direction: "DOWN",
          currentStation: "Delhi Cantt",
          currentStationCode: "DEC",
          nextStation: "Gurugram",
          nextStationCode: "GGN",
          delayMinutes: 0,
          status: "ON TIME",
          speedKmH: 110,
          latitude: 28.5910,
          longitude: 77.1215,
          distanceToProblemKm: 28.6,
          timeToArrivalMin: 16,
          arrivalEta: "18:29",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [28.5910, 77.1215]
        },
        {
          trainNumber: "22452",
          trainName: "Chandigarh–Bandra SF Express",
          type: "Superfast",
          route: "Chandigarh (CDG) → Bandra Terminus (BDTS)",
          direction: "DOWN",
          currentStation: "Rewari Junction",
          currentStationCode: "RE",
          nextStation: "Khalilpur",
          nextStationCode: "KIP",
          delayMinutes: 5,
          status: "ON TIME",
          speedKmH: 80,
          latitude: 28.1968,
          longitude: 76.6190,
          distanceToProblemKm: 24.5,
          timeToArrivalMin: 20,
          arrivalEta: "18:33",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [28.1968, 76.6190]
        },
        {
          trainNumber: "12414",
          trainName: "Pooja Superfast Express",
          type: "Superfast",
          route: "Jammu Tawi (JAT) → Ajmer (AII)",
          direction: "DOWN",
          currentStation: "Old Delhi",
          currentStationCode: "DLI",
          nextStation: "Delhi Cantt",
          nextStationCode: "DEC",
          delayMinutes: 35,
          status: "DELAYED +35m",
          speedKmH: 85,
          latitude: 28.6619,
          longitude: 77.2274,
          distanceToProblemKm: 42.0,
          timeToArrivalMin: 44,
          arrivalEta: "18:57",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [28.6619, 77.2274]
        }
      ],
      recommendedBlock: "19:15 — 20:15 hrs",
      recommendationRationale: "Shifted window: Commences 18 mins after Train 12414 (Pooja Superfast Express) clears track segment.",
      levelAdvisory: "SSE Directive: Mobilize Gang T-01 at trackside marker Km 54/8 Up Main Line. Hold physical rail cutting until Train 12916 passes. Issue 30 km/h pilot caution order.",
      rapidApiActive: false,
      lastRefreshed: "18:30:00"
    },
    "UMB-SIR": {
      sectionKey: "UMB-SIR",
      sectionName: "Ambala Cantt → Sirhind (Northern Railway / Ambala Division)",
      zone: "NR",
      division: "Ambala",
      problemPoint: {
        id: "PROB-UMB-SIR-142",
        type: "Track Geometric Irregularity & BCM Tamping",
        milepost: "Km 142/4 Up Main Line (Near Rajpura Jn)",
        lat: 30.4839,
        lng: 76.5936,
        proposedBlockWindow: "02:00 — 05:00 hrs",
        urgency: "HIGH",
        description: "Ballast cleaning machine BCM-82 deep screening & cross-level realignment over 1,200m track corridor."
      },
      trains: [
        {
          trainNumber: "22439",
          trainName: "Vande Bharat Express (Katra)",
          type: "Vande Bharat",
          route: "New Delhi (NDLS) → SVDK Katra",
          direction: "UP",
          currentStation: "Rajpura Junction",
          currentStationCode: "RPJ",
          nextStation: "Sirhind",
          nextStationCode: "SIR",
          delayMinutes: 0,
          status: "ON TIME",
          speedKmH: 130,
          latitude: 30.4839,
          longitude: 76.5936,
          distanceToProblemKm: 6.2,
          timeToArrivalMin: 8,
          arrivalEta: "02:18",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [30.4839, 76.5936]
        },
        {
          trainNumber: "12011",
          trainName: "Kalka Shatabdi Express",
          type: "Shatabdi",
          route: "New Delhi (NDLS) → Kalka (KLK)",
          direction: "UP",
          currentStation: "Ambala Cantt",
          currentStationCode: "UMB",
          nextStation: "Rajpura",
          nextStationCode: "RPJ",
          delayMinutes: 0,
          status: "ON TIME",
          speedKmH: 105,
          latitude: 30.3577,
          longitude: 76.7960,
          distanceToProblemKm: 18.0,
          timeToArrivalMin: 14,
          arrivalEta: "02:24",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [30.3577, 76.7960]
        },
        {
          trainNumber: "12424",
          trainName: "Dibrugarh Rajdhani Express",
          type: "Rajdhani",
          route: "New Delhi (NDLS) → Dibrugarh (DBRG)",
          direction: "DOWN",
          currentStation: "Sirhind Junction",
          currentStationCode: "SIR",
          nextStation: "Rajpura",
          nextStationCode: "RPJ",
          delayMinutes: 15,
          status: "DELAYED +15m",
          speedKmH: 115,
          latitude: 30.6270,
          longitude: 76.3814,
          distanceToProblemKm: 22.4,
          timeToArrivalMin: 18,
          arrivalEta: "02:28",
          conflictLevel: "CRITICAL",
          conflictTag: "⚠️ CRITICAL CONFLICT",
          conflictColor: "#DC2626",
          pointerCoords: [30.6270, 76.3814]
        }
      ],
      recommendedBlock: "03:15 — 06:15 hrs",
      recommendationRationale: "Shifted window: Commences after Train 12424 clears section.",
      levelAdvisory: "SSE Directive: Mobilize BCM-82 at Rajpura Siding. Hold possession until Train 22439 passes.",
      rapidApiActive: false,
      lastRefreshed: "18:30:00"
    }
  },

  // ── Tile Providers & Map Themes (Real-World Railway GIS Infrastructure) ───
  themes: {
    openrailway: {
      name: "OpenRailwayMap GIS (Real Tracks & Yards)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      overlayUrl: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
      containerClass: "map-theme-openrailway"
    },
    satellite: {
      name: "High-Res Satellite Hybrid",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      overlayUrl: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
      overlayOpacity: 0.85,
      containerClass: "map-theme-satellite"
    },
    midnight: {
      name: "Tactical Midnight Command",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      overlayUrl: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
      containerClass: "map-theme-midnight"
    },
    surveyor: {
      name: "Civil Surveyor Topo (Clean)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      overlayUrl: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
      subdomains: "abc",
      maxZoom: 19,
      containerClass: "map-theme-surveyor"
    }
  },

  // ── Initialize Map ─────────────────────────────────────────────────────────
  init(containerId) {
    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    // Default center on Delhi – Gurugram – Rewari corridor
    const center = [28.43, 76.92];
    const zoom = 10;

    this.map = L.map(containerId, {
      center: center,
      zoom: zoom,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: false
    });

    this.map.zoomControl.setPosition('bottomright');
    this.setTheme('openrailway');

    // Initialize layer groups in proper rendering order (bottom to top)
    this.layers.infrastructure = L.layerGroup().addTo(this.map);
    this.layers.tracks = L.layerGroup().addTo(this.map);
    this.layers.mileposts = L.layerGroup().addTo(this.map);
    this.layers.signals = L.layerGroup().addTo(this.map);
    this.layers.stations = L.layerGroup().addTo(this.map);
    this.layers.problem = L.layerGroup().addTo(this.map);
    this.layers.trainPointers = L.layerGroup().addTo(this.map);
    this.layers.vectors = L.layerGroup().addTo(this.map);

    // Synchronize initial activeSection with session corridor/division
    if (typeof AUTH !== "undefined" && typeof AUTH.getSession === "function") {
      const s = AUTH.getSession();
      if (s && s.corridor === "UMB-SIR") {
        this.activeSection = "UMB-SIR";
      } else if (s && s.corridor === "RE-GGN") {
        this.activeSection = "RE-GGN";
      } else if (s && s.division === "Ambala") {
        this.activeSection = "UMB-SIR";
      } else if (s && s.division === "Delhi") {
        this.activeSection = "RE-GGN";
      }
    }

    // Initial baseline data setup
    this.currentData = JSON.parse(JSON.stringify(this.DEFAULT_DATA[this.activeSection] || this.DEFAULT_DATA["RE-GGN"]));

    // Initial render for active section
    this.loadSection(this.activeSection);

    // Bind event listeners
    this.initControls();

    // Start auto-refresh interval
    this.startAutoRefresh();

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
  },

  // ── Set Map Theme ──────────────────────────────────────────────────────────
  setTheme(themeKey) {
    const theme = this.themes[themeKey] || this.themes.openrailway;
    if (!theme || !this.map) return;

    this.currentTheme = themeKey;

    if (this.activeTileLayer) {
      this.map.removeLayer(this.activeTileLayer);
    }
    if (this.activeOverlayLayer) {
      this.map.removeLayer(this.activeOverlayLayer);
      this.activeOverlayLayer = null;
    }

    const container = document.getElementById("networkMapContainer");
    if (container) {
      container.className = `network-map-container ${theme.containerClass}`;
    }

    this.activeTileLayer = L.tileLayer(theme.url, {
      subdomains: theme.subdomains || "abcd",
      maxZoom: theme.maxZoom || 19,
      attribution: false
    }).addTo(this.map);

    if (theme.overlayUrl) {
      this.activeOverlayLayer = L.tileLayer(theme.overlayUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        opacity: theme.overlayOpacity || 0.95,
        attribution: false
      }).addTo(this.map);
    }
  },

  // ── Load Section Geometry & Live Telemetry ─────────────────────────────────
  async loadSection(sectionKey) {
    this.activeSection = sectionKey;
    this.stopTrainSlowMovement();

    // Clear active layers
    this.layers.infrastructure.clearLayers();
    this.layers.tracks.clearLayers();
    this.layers.mileposts.clearLayers();
    this.layers.signals.clearLayers();
    this.layers.stations.clearLayers();
    this.layers.problem.clearLayers();
    this.layers.trainPointers.clearLayers();
    this.layers.vectors.clearLayers();

    // Initialize baseline synchronous data immediately so problem is NEVER missing
    this.currentData = JSON.parse(JSON.stringify(this.DEFAULT_DATA[sectionKey] || this.DEFAULT_DATA["RE-GGN"]));

    // Render Track & Stations according to selected section
    if (sectionKey === "RE-GGN") {
      this.renderRewariGurugramTrack();
      this.map.flyTo([28.43, 76.92], 10, { duration: 0.8 });
    } else {
      this.renderAmbalaSirhindTrack();
      this.map.flyTo([30.48, 76.60], 10, { duration: 0.8 });
    }

    // Render the simulated track problem marker immediately
    this.renderProblemMarker(this.currentData.problemPoint);

    // Fetch live telemetry from backend proxy
    await this.fetchCorridorTelemetry();
  },

  // ── Render Multi-Aspect Automatic Color Light Signals (MACLS) ─────────────
  renderSignals(signals) {
    if (!this.layers.signals || !signals) return;
    this.layers.signals.clearLayers();

    signals.forEach(sig => {
      const lampClass = sig.aspect === "green" ? "green" : (sig.aspect === "yellow" ? "yellow" : "red");
      const iconHtml = `
        <div class="rail-signal-housing" title="${sig.name} • ${sig.status}">
          <div class="rail-signal-lamp ${lampClass}"></div>
          <div class="rail-signal-id">${sig.id}</div>
        </div>
      `;
      const icon = L.divIcon({
        className: 'rail-signal-marker',
        html: iconHtml,
        iconSize: [22, 28],
        iconAnchor: [11, 14]
      });
      const marker = L.marker(sig.pos, { icon }).addTo(this.layers.signals);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 5px; min-width: 220px;">
          <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase;">Indian Railways Automatic Block Signal</div>
          <div style="font-size: 13.5px; font-weight: 800; color: #0F172A; margin: 2px 0;">${sig.name} (${sig.code})</div>
          <div style="display: flex; align-items: center; gap: 6px; margin: 6px 0; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 5px 8px; border-radius: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${sig.aspect === 'green' ? '#10B981' : (sig.aspect === 'yellow' ? '#F59E0B' : '#EF4444')};"></span>
            <strong style="font-size: 12px; color: #0F172A;">Aspect: ${sig.aspect.toUpperCase()}</strong>
          </div>
          <div style="font-size: 11.5px; color: #475569;">
            Status: <strong>${sig.status}</strong>
          </div>
          <div style="font-size: 10.5px; color: #64748B; margin-top: 4px; border-top: 1px dashed #CBD5E1; padding-top: 4px;">
            Interlock Circuit: <strong>Continuous Audio-Frequency Track Circuit (AFTC)</strong>
          </div>
        </div>
      `);
    });
  },

  // ── Render Engineering Kilometer Mileposts ──────────────────────────────────
  renderMileposts(mileposts) {
    if (!this.layers.mileposts || !mileposts) return;
    this.layers.mileposts.clearLayers();

    mileposts.forEach(mp => {
      const isDefect = Boolean(mp.isDefect);
      const iconHtml = `
        <div class="rail-milepost-stone ${isDefect ? 'rail-milepost-defect' : ''}" title="Milepost ${mp.mp}">
          <div class="rail-milepost-top">IR</div>
          <div class="rail-milepost-val">${mp.mp}</div>
        </div>
      `;
      const icon = L.divIcon({
        className: 'rail-milepost-marker',
        html: iconHtml,
        iconSize: [30, 22],
        iconAnchor: [15, 11]
      });
      const marker = L.marker(mp.pos, { icon }).addTo(this.layers.mileposts);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px;">
          <strong style="font-size: 12.5px; color: #0F172A;">Chainage Milepost: ${mp.mp}</strong>
          <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
            Northern Railway • High-Density Rail Network
          </div>
          ${isDefect ? '<div style="margin-top: 4px; font-size: 11px; color: #DC2626; font-weight: 700;">⚠️ Recorded Ultrasonic Flaw Location (MT-1042)</div>' : ''}
        </div>
      `);
    });
  },

  // ── Render Station Badges & Platforms ──────────────────────────────────────
  renderStations(stations) {
    if (!this.layers.stations || !stations) return;
    this.layers.stations.clearLayers();

    stations.forEach(stn => {
      const typeClass = stn.type === "terminal" ? "rail-station-type-terminal" : (stn.type === "junction" ? "rail-station-type-junction" : "");
      const iconHtml = `
        <div class="rail-station-badge ${typeClass}" title="${stn.name} (${stn.code})">
          <div class="rail-station-diamond"></div>
          <span class="rail-station-code">${stn.code}</span>
        </div>
      `;
      const icon = L.divIcon({
        className: 'rail-station-marker',
        html: iconHtml,
        iconSize: [52, 20],
        iconAnchor: [26, 10]
      });
      const marker = L.marker(stn.pos, { icon }).addTo(this.layers.stations);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: #0F172A; font-size: 13.5px;">${stn.name} (${stn.code})</strong>
            <span style="background:#0284C7;color:white;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;">
              ${stn.type ? stn.type.toUpperCase() : 'STATION'}
            </span>
          </div>
          <div style="font-size: 11.5px; color: #475569; margin-bottom: 4px;">
            Platforms: <strong>${stn.platforms || 4}</strong> • Loop Tracks: <strong>${stn.loops || 2}</strong>
          </div>
          <div style="font-size: 11px; color: #64748B;">
            Signaling: <strong>Electronic Interlocking (EI) • Central Route Setting</strong>
          </div>
        </div>
      `);
    });
  },

  // ── Render Manned Level Crossing (LC) Gates ────────────────────────────────
  renderLevelCrossings(lcGates) {
    if (!lcGates || !this.layers.stations) return;
    lcGates.forEach(lc => {
      const iconHtml = `
        <div class="rail-lc-badge" title="${lc.name} • ${lc.status}">
          <span>🚧</span>
          <span>${lc.name}</span>
        </div>
      `;
      const icon = L.divIcon({
        className: 'rail-lc-marker',
        html: iconHtml,
        iconSize: [68, 18],
        iconAnchor: [34, 9]
      });
      const marker = L.marker(lc.pos, { icon }).addTo(this.layers.stations);
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px;">
          <strong style="color: #0F172A; font-size: 12px;">Level Crossing: ${lc.name}</strong>
          <div style="font-size: 11px; color: #92400E; margin-top: 2px;">
            Gate Interlock: <strong>${lc.status}</strong>
          </div>
        </div>
      `);
    });
  },

  // ── Render High-Precision Delhi – Gurugram – Rewari GIS Track Corridor ──────
  renderRewariGurugramTrack() {
    // True Surveyed GIS Alignment with 37 Coordinate Nodes
    this.trackCoords = [
      [28.1968, 76.6190], // Rewari Junction (RE)
      [28.2045, 76.6265], // Rewari Yard & North Throat
      [28.2180, 76.6450], // Gokalgarh Approach
      [28.2320, 76.6690], // Kumbhawas Hault
      [28.2450, 76.6910], // Khalilpur Outer
      [28.2580, 76.7110], // Khalilpur (KIP)
      [28.2720, 76.7280], // Khalilpur North Curve
      [28.2830, 76.7390], // Siha Curve
      [28.2915, 76.7490], // Inchhapuri (IHP)
      [28.3090, 76.7680], // Pataudi Approach Tangent
      [28.3283, 76.7865], // Pataudi Road (PTRD)
      [28.3440, 76.8060], // Pataudi North Curve
      [28.3610, 76.8290], // Jataula Samphka (JSKA)
      [28.3740, 76.8480], // Km 54 Defect Approach
      [28.3848, 76.8623], // Km 54/8 Track Defect Point (MT-1042)
      [28.3940, 76.8740], // Patli Outer Distant Signal
      [28.4010, 76.8820], // Patli (PT)
      [28.4170, 76.9030], // Dhankot Curve
      [28.4310, 76.9220], // Garhi Harsaru Outer
      [28.4414, 76.9381], // Garhi Harsaru Junction (GHH)
      [28.4480, 76.9530], // Farukhnagar Chord Junction
      [28.4550, 76.9750], // Basai Dhankot (BDXT)
      [28.4610, 76.9940], // Gurugram Yard West
      [28.4682, 77.0175], // Gurugram Station (GGN)
      [28.4790, 77.0310], // Gurugram East Curve
      [28.4980, 77.0420], // Haryana-Delhi Border
      [28.5320, 77.0580], // Bijwasan (BWSN)
      [28.5550, 77.0720], // Shahabad Mohammadpur (SMDP)
      [28.5833, 77.0833], // Palam (PM)
      [28.5880, 77.1010], // Palam North Curve
      [28.5910, 77.1215], // Delhi Cantt (DEC)
      [28.6180, 77.1350], // Ring Railway Crossover
      [28.6420, 77.1510], // Kirti Nagar Chord
      [28.6530, 77.1620], // Patel Nagar (PTNR)
      [28.6657, 77.1866], // Delhi Sarai Rohilla (DEE)
      [28.6640, 77.2020], // Kishanganj (DKZ)
      [28.6580, 77.2150], // Sadar Bazar (DSB)
      [28.6619, 77.2274]  // Old Delhi Junction (DLI)
    ];

    // Wide transparent hit-area for interactive clicking anywhere on the track
    const hitArea = L.polyline(this.trackCoords, {
      color: "transparent",
      weight: 26,
      opacity: 0.01,
      interactive: true
    }).addTo(this.layers.tracks);

    hitArea.bindTooltip("🛤️ Click anywhere on railway track to simulate track flaw & track approaching express fleet!", {
      sticky: true,
      className: "track-click-tooltip"
    });

    hitArea.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      this.handleRouteClick(e.latlng);
    });

    // 1. Up Main Line: Heavy Ballast Bed Casing
    L.polyline(this.trackCoords, {
      color: "#0F172A",
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 2. Up Main Line: Concrete Sleepers / Ties (White Dash Pattern)
    L.polyline(this.trackCoords, {
      color: "#E2E8F0",
      weight: 5,
      opacity: 0.82,
      dashArray: '2, 6',
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 3. Up Main Line: Electrified 25kV OHE Core Line
    const upTrackLine = L.polyline(this.trackCoords, {
      color: "#0284C7",
      weight: 2.5,
      opacity: 1,
      interactive: true
    }).addTo(this.layers.tracks);

    upTrackLine.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      this.handleRouteClick(e.latlng);
    });

    // 4. Down Main Line: Parallel Double Track (Offset ~0.0014 deg)
    const downTrackCoords = this.trackCoords.map(pt => [pt[0] - 0.0012, pt[1] + 0.0014]);
    L.polyline(downTrackCoords, {
      color: "#0F172A",
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      interactive: false
    }).addTo(this.layers.infrastructure);

    L.polyline(downTrackCoords, {
      color: "#E2E8F0",
      weight: 5,
      opacity: 0.82,
      dashArray: '2, 6',
      interactive: false
    }).addTo(this.layers.infrastructure);

    L.polyline(downTrackCoords, {
      color: "#0369A1",
      weight: 2.2,
      opacity: 0.9,
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 5. Automatic Multi-Aspect Block Signals along corridor
    const signals = [
      { id: "S-12", name: "Rewari Advance Starter", code: "RE-AS-12", pos: [28.2180, 76.6450], aspect: "green", status: "CLEAR (Normal Headway)" },
      { id: "S-24", name: "Khalilpur Home Signal", code: "KIP-H-24", pos: [28.2720, 76.7280], aspect: "green", status: "CLEAR (Main Line Set)" },
      { id: "S-38", name: "Pataudi Intermediate Block Signal (IBS)", code: "PTRD-IBS-38", pos: [28.3440, 76.8060], aspect: "yellow", status: "CAUTION (Speed Limit 60 km/h)" },
      { id: "S-54", name: "Maintenance Block Possession Signal", code: "BLK-SIG-54", pos: [28.3740, 76.8480], aspect: "red", status: "DANGER / BLOCKED (Ultrasonic Flaw Possession)" },
      { id: "S-62", name: "Patli Advanced Starter", code: "PT-AS-62", pos: [28.4170, 76.9030], aspect: "green", status: "CLEAR (Down Line Open)" },
      { id: "S-70", name: "Garhi Harsaru Junction Home", code: "GHH-H-70", pos: [28.4310, 76.9220], aspect: "yellow", status: "DOUBLE YELLOW (Approach Yard)" },
      { id: "S-88", name: "Gurugram Home Signal", code: "GGN-H-88", pos: [28.4610, 76.9940], aspect: "green", status: "CLEAR (Platform 1)" },
      { id: "S-94", name: "Delhi Cantt Distant Signal", code: "DEC-DS-94", pos: [28.5880, 77.1010], aspect: "green", status: "CLEAR" }
    ];
    this.renderSignals(signals);

    // 6. Chainage Mileposts along ballast shoulder
    const mileposts = [
      { mp: "Km 48", pos: [28.3283, 76.7865] },
      { mp: "Km 50", pos: [28.3440, 76.8060] },
      { mp: "Km 52", pos: [28.3610, 76.8290] },
      { mp: "Km 54/8 ⚠️", pos: [28.3848, 76.8623], isDefect: true },
      { mp: "Km 58", pos: [28.4010, 76.8820] },
      { mp: "Km 62", pos: [28.4170, 76.9030] },
      { mp: "Km 70", pos: [28.4414, 76.9381] },
      { mp: "Km 84", pos: [28.4682, 77.0175] }
    ];
    this.renderMileposts(mileposts);

    // 7. Stations along the line
    const stations = [
      { name: "Rewari Junction", code: "RE", pos: [28.1968, 76.6190], type: "terminal", platforms: 8, loops: 4 },
      { name: "Khalilpur", code: "KIP", pos: [28.2580, 76.7110], type: "station", platforms: 2, loops: 1 },
      { name: "Inchhapuri", code: "IHP", pos: [28.2915, 76.7490], type: "station", platforms: 2, loops: 1 },
      { name: "Pataudi Road", code: "PTRD", pos: [28.3283, 76.7865], type: "station", platforms: 3, loops: 2 },
      { name: "Jataula Samphka", code: "JSKA", pos: [28.3610, 76.8290], type: "station", platforms: 2, loops: 1 },
      { name: "Patli", code: "PT", pos: [28.4010, 76.8820], type: "station", platforms: 2, loops: 1 },
      { name: "Garhi Harsaru Junction", code: "GHH", pos: [28.4414, 76.9381], type: "junction", platforms: 5, loops: 3 },
      { name: "Basai Dhankot", code: "BDXT", pos: [28.4550, 76.9750], type: "station", platforms: 2, loops: 1 },
      { name: "Gurugram", code: "GGN", pos: [28.4682, 77.0175], type: "junction", platforms: 4, loops: 2 },
      { name: "Bijwasan", code: "BWSN", pos: [28.5320, 77.0580], type: "station", platforms: 4, loops: 2 },
      { name: "Palam", code: "PM", pos: [28.5833, 77.0833], type: "station", platforms: 3, loops: 1 },
      { name: "Delhi Cantt", code: "DEC", pos: [28.5910, 77.1215], type: "junction", platforms: 5, loops: 3 },
      { name: "Delhi Sarai Rohilla", code: "DEE", pos: [28.6657, 77.1866], type: "junction", platforms: 7, loops: 4 },
      { name: "Old Delhi Junction", code: "DLI", pos: [28.6619, 77.2274], type: "terminal", platforms: 16, loops: 6 }
    ];
    this.renderStations(stations);

    // 8. Level Crossing Gates
    const lcGates = [
      { name: "LC-24", pos: [28.2915, 76.7490], status: "CLOSED & INTERLOCKED (Signal S-24)" },
      { name: "LC-29", pos: [28.3610, 76.8290], status: "CLOSED & LOCKED (Auto-Barrier)" },
      { name: "LC-35", pos: [28.4480, 76.9530], status: "OPEN FOR ROAD TRAFFIC" }
    ];
    this.renderLevelCrossings(lcGates);
  },

  // ── Render High-Precision Ambala – Sirhind – Ludhiana GIS Track Corridor ────
  renderAmbalaSirhindTrack() {
    // True Surveyed Grand Trunk Route GIS Alignment with 20 Precision Nodes
    this.trackCoords = [
      [30.3577, 76.7960], // Ambala Cantt Junction (UMB)
      [30.3640, 76.7880], // Ambala Cantt North Yard
      [30.3780, 76.7720], // Ambala City (UBC)
      [30.3950, 76.7450], // Ambala North High-Speed Tangent
      [30.4120, 76.7150], // Sambhu Outer Distant
      [30.4280, 76.6890], // Sambhu (SMU)
      [30.4560, 76.6380], // Rajpura Outer Curve
      [30.4839, 76.5936], // Rajpura Junction (RPJ)
      [30.5010, 76.5680], // Km 142/4 BCM Tamping Defect Point
      [30.5420, 76.5120], // Sarai Banjara (SBJ)
      [30.5890, 76.4420], // Sadhoogarh (SDY)
      [30.6270, 76.3814], // Sirhind Junction (SIR)
      [30.6650, 76.3050], // Mandi Gobindgarh (GVG)
      [30.6860, 76.2620], // Khanna Outer
      [30.7020, 76.2210], // Khanna (KNN)
      [30.7510, 76.1280], // Chawapall (CHA)
      [30.7980, 76.0280], // Doraha (DOA)
      [30.8410, 75.9520], // Sanehwal (SNL)
      [30.8700, 75.9080], // Dhandari Kalan (DDL)
      [30.8901, 75.8573]  // Ludhiana Junction (LDH)
    ];

    const hitArea = L.polyline(this.trackCoords, {
      color: "transparent",
      weight: 26,
      opacity: 0.01,
      interactive: true
    }).addTo(this.layers.tracks);

    hitArea.bindTooltip("🛤️ Click anywhere on railway track to simulate track flaw & track approaching express fleet!", {
      sticky: true,
      className: "track-click-tooltip"
    });

    hitArea.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      this.handleRouteClick(e.latlng);
    });

    // 1. Up Main Line: Ballast Casing
    L.polyline(this.trackCoords, {
      color: "#0F172A",
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 2. Up Main Line: Sleepers (White Dashes)
    L.polyline(this.trackCoords, {
      color: "#E2E8F0",
      weight: 5,
      opacity: 0.82,
      dashArray: '2, 6',
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 3. Up Main Line: Active Electrified Core Line
    const upTrackLine = L.polyline(this.trackCoords, {
      color: "#0284C7",
      weight: 2.5,
      opacity: 1,
      interactive: true
    }).addTo(this.layers.tracks);

    trackLine = upTrackLine;
    trackLine.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      this.handleRouteClick(e.latlng);
    });

    // 4. Down Main Line: Parallel Double Track
    const downTrackCoords = this.trackCoords.map(pt => [pt[0] - 0.0014, pt[1] + 0.0016]);
    L.polyline(downTrackCoords, {
      color: "#0F172A",
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      interactive: false
    }).addTo(this.layers.infrastructure);

    L.polyline(downTrackCoords, {
      color: "#E2E8F0",
      weight: 5,
      opacity: 0.82,
      dashArray: '2, 6',
      interactive: false
    }).addTo(this.layers.infrastructure);

    L.polyline(downTrackCoords, {
      color: "#0369A1",
      weight: 2.2,
      opacity: 0.9,
      interactive: false
    }).addTo(this.layers.infrastructure);

    // 5. Signals along Grand Trunk Line
    const signals = [
      { id: "S-102", name: "Ambala Cantt North Starter", code: "UMB-NS-102", pos: [30.3640, 76.7880], aspect: "green", status: "CLEAR (130 km/h Track)" },
      { id: "S-118", name: "Sambhu Intermediate Block Signal", code: "SMU-IBS-118", pos: [30.4120, 76.7150], aspect: "green", status: "CLEAR" },
      { id: "S-136", name: "Rajpura Junction Home", code: "RPJ-H-136", pos: [30.4560, 76.6380], aspect: "yellow", status: "CAUTION (Approaching Block)" },
      { id: "S-142", name: "BCM Tamping Block Signal", code: "BLK-SIG-142", pos: [30.5010, 76.5680], aspect: "red", status: "DANGER / BLOCKED (BCM Tamping Possession)" },
      { id: "S-164", name: "Sirhind Outer Distant", code: "SIR-OD-164", pos: [30.5890, 76.4420], aspect: "green", status: "CLEAR" },
      { id: "S-188", name: "Khanna Starter Signal", code: "KNN-S-188", pos: [30.7020, 76.2210], aspect: "green", status: "CLEAR" },
      { id: "S-204", name: "Ludhiana Distant Signal", code: "LDH-DS-204", pos: [30.8700, 75.9080], aspect: "green", status: "CLEAR" }
    ];
    this.renderSignals(signals);

    // 6. Chainage Mileposts
    const mileposts = [
      { mp: "Km 130", pos: [30.3780, 76.7720] },
      { mp: "Km 136", pos: [30.4280, 76.6890] },
      { mp: "Km 142/4 ⚠️", pos: [30.5010, 76.5680], isDefect: true },
      { mp: "Km 150", pos: [30.5420, 76.5120] },
      { mp: "Km 165", pos: [30.6270, 76.3814] },
      { mp: "Km 180", pos: [30.7020, 76.2210] }
    ];
    this.renderMileposts(mileposts);

    // 7. Stations
    const stations = [
      { name: "Ambala Cantt Junction", code: "UMB", pos: [30.3577, 76.7960], type: "terminal", platforms: 7, loops: 4 },
      { name: "Ambala City", code: "UBC", pos: [30.3780, 76.7720], type: "station", platforms: 2, loops: 1 },
      { name: "Sambhu", code: "SMU", pos: [30.4280, 76.6890], type: "station", platforms: 2, loops: 1 },
      { name: "Rajpura Junction", code: "RPJ", pos: [30.4839, 76.5936], type: "junction", platforms: 4, loops: 2 },
      { name: "Sarai Banjara", code: "SBJ", pos: [30.5420, 76.5120], type: "station", platforms: 2, loops: 1 },
      { name: "Sadhoogarh", code: "SDY", pos: [30.5890, 76.4420], type: "station", platforms: 2, loops: 1 },
      { name: "Sirhind Junction", code: "SIR", pos: [30.6270, 76.3814], type: "junction", platforms: 4, loops: 2 },
      { name: "Mandi Gobindgarh", code: "GVG", pos: [30.6650, 76.3050], type: "station", platforms: 2, loops: 1 },
      { name: "Khanna", code: "KNN", pos: [30.7020, 76.2210], type: "station", platforms: 3, loops: 2 },
      { name: "Doraha", code: "DOA", pos: [30.7980, 76.0280], type: "station", platforms: 2, loops: 1 },
      { name: "Ludhiana Junction", code: "LDH", pos: [30.8901, 75.8573], type: "terminal", platforms: 10, loops: 5 }
    ];
    this.renderStations(stations);

    // 8. Level Crossing Gates
    const lcGates = [
      { name: "LC-112", pos: [30.4280, 76.6890], status: "CLOSED & INTERLOCKED (Signal S-118)" },
      { name: "LC-118", pos: [30.5420, 76.5120], status: "CLOSED & LOCKED (Interlocked with CTC)" }
    ];
    this.renderLevelCrossings(lcGates);
  },

  // ── Fetch Corridor Telemetry from Backend Proxy ────────────────────────────
  async fetchCorridorTelemetry() {
    const session = typeof AUTH !== "undefined" ? AUTH.getSession() : null;
    const roleLevel = session && session.roleLevel !== undefined ? session.roleLevel : 4;

    try {
      const res = await fetch(`/api/trains/corridor?section=${encodeURIComponent(this.activeSection)}&roleLevel=${roleLevel}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json && json.success) {
        this.currentData = json.data;
        this.renderProblemMarker(json.data.problemPoint);

        // Update live status badge
        const streamLabel = document.getElementById("mapStreamLabel");
        const streamClock = document.getElementById("mapStreamClock");
        const activeTrainCount = document.getElementById("mapActiveTrainCount");

        if (streamLabel) {
          streamLabel.textContent = json.data.rapidApiActive ? "RAPIDAPI LIVE TELEMETRY" : "NTES LIVE TELEMETRY";
        }
        if (streamClock) {
          streamClock.textContent = `• Updated: ${json.data.lastRefreshed}`;
        }
        if (activeTrainCount) {
          activeTrainCount.textContent = json.data.trains.length;
        }

        // If HUD is open, refresh HUD contents and update moving train targets
        const hud = document.getElementById("trackProblemHud");
        if (hud && hud.style.display !== "none") {
          this.populateProblemHud(json.data);
          this.renderTrainRunningPointers(json.data.trains, json.data.problemPoint);
        }
      }
    } catch (err) {
      console.warn("[RailMap] Live API fetch fallback active:", err);
      // Ensure currentData is already present
      if (!this.currentData) {
        this.currentData = JSON.parse(JSON.stringify(this.DEFAULT_DATA[this.activeSection] || this.DEFAULT_DATA["RE-GGN"]));
      }
      this.renderProblemMarker(this.currentData.problemPoint);
    }
  },

  // ── Render Track Disruption / Maintenance Problem Marker ────────────────────
  renderProblemMarker(problem) {
    this.layers.problem.clearLayers();
    if (!problem) return;

    const iconHtml = `
      <div class="track-problem-pin" title="Click to inspect approaching trains & block conflicts">
        <div class="track-problem-pulse"></div>
        <div class="track-problem-label">
          <span>⚠️</span>
          <span>${problem.type}</span>
        </div>
        <div class="track-problem-icon">⚠️</div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'track-problem-div-icon',
      html: iconHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const marker = L.marker([problem.lat, problem.lng], { icon, zIndexOffset: 1000 }).addTo(this.layers.problem);

    marker.on('click', (e) => {
      if (e) {
        L.DomEvent.stopPropagation(e);
      }
      if (this._suppressTrackClicks) return;
      this.onProblemClick();
    });
  },

  // ── Helper: Snap Point to Nearest Polyline Track Segment ───────────────────
  snapPointToTrack(clickLatLng) {
    if (!this.trackCoords || this.trackCoords.length < 2) {
      return { lat: clickLatLng.lat, lng: clickLatLng.lng, distKm: 0, kmMark: 54.8 };
    }

    let bestPoint = { lat: this.trackCoords[0][0], lng: this.trackCoords[0][1] };
    let minDistance = Infinity;
    let accumulatedKm = 0;
    let bestKm = 0;

    for (let i = 0; i < this.trackCoords.length - 1; i++) {
      const p1 = this.trackCoords[i];
      const p2 = this.trackCoords[i + 1];
      const segLen = this.haversineKm(p1[0], p1[1], p2[0], p2[1]);

      // Project click point onto segment p1-p2
      const proj = this.projectOnSegment(clickLatLng.lat, clickLatLng.lng, p1[0], p1[1], p2[0], p2[1]);
      const dist = this.haversineKm(clickLatLng.lat, clickLatLng.lng, proj.lat, proj.lng);

      if (dist < minDistance) {
        minDistance = dist;
        bestPoint = proj;
        bestKm = accumulatedKm + (proj.t * segLen);
      }
      accumulatedKm += segLen;
    }

    return {
      lat: bestPoint.lat,
      lng: bestPoint.lng,
      distKm: minDistance,
      kmMark: Math.round(bestKm * 10) / 10
    };
  },

  projectOnSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return { lat: ax, lng: ay, t: 0 };

    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return {
      lat: ax + t * dx,
      lng: ay + t * dy,
      t
    };
  },

  haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  },

  // ── Handle Clicking Anywhere on Track to Simulate Problem ───────────────────
  handleRouteClick(clickLatLng) {
    if (this._suppressTrackClicks) return;
    const snapped = this.snapPointToTrack(clickLatLng);

    if (!this.currentData) {
      this.currentData = JSON.parse(JSON.stringify(this.DEFAULT_DATA[this.activeSection] || this.DEFAULT_DATA["RE-GGN"]));
    }

    // Update the simulated problem location to the clicked track point
    this.currentData.problemPoint.lat = snapped.lat;
    this.currentData.problemPoint.lng = snapped.lng;
    this.currentData.problemPoint.milepost = `Km ${snapped.kmMark} Up Main Line (Interactive Track Pin)`;
    this.currentData.problemPoint.type = "Simulated Track Flaw & Emergency Block";
    this.currentData.problemPoint.description = `Active simulated track disruption placed at Km ${snapped.kmMark}. Live express fleet approaching along corridor.`;

    // Recalculate train distances and arrival times to this new track problem
    this.recalculateTrainApproaches(snapped.lat, snapped.lng);

    // Re-render pulsing problem marker
    this.renderProblemMarker(this.currentData.problemPoint);

    // Show toast
    if (typeof showToast === "function") {
      showToast(`Track Problem simulated at Km ${snapped.kmMark} • Live trains running slowly along route.`);
    }

    // Trigger HUD and start slow movement
    this.onProblemClick();
  },

  handleMapOrRouteClick(latlng) {
    if (this._suppressTrackClicks) return;
    // Only snap if clicked right on the track line (within 0.8 km)
    const snapped = this.snapPointToTrack(latlng);
    if (snapped.distKm <= 0.8) {
      this.handleRouteClick(latlng);
    }
  },

  // ── Recalculate Trains Approaches & Arrival Minutes ─────────────────────────
  recalculateTrainApproaches(targetLat, targetLng) {
    if (!this.currentData || !this.currentData.trains) return;

    this.currentData.trains.forEach(t => {
      const startCoord = t.pointerCoords || [t.latitude, t.longitude];
      const dist = Math.max(4, Math.round(this.haversineKm(startCoord[0], startCoord[1], targetLat, targetLng) * 10) / 10);
      const speed = Math.max(45, t.speedKmH || 80);
      const arrivalMin = Math.max(4, Math.round((dist / speed) * 60) + Math.round((t.delayMinutes || 0) * 0.3));

      const arrDate = new Date(Date.now() + arrivalMin * 60 * 1000);
      const etaStr = arrDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

      t.distanceToProblemKm = dist;
      t.timeToArrivalMin = arrivalMin;
      t.arrivalEta = etaStr;

      // In conflict if arrival is within 35 mins
      if (arrivalMin <= 25) {
        t.conflictLevel = "CRITICAL";
        t.conflictTag = "⚠️ CRITICAL CONFLICT";
        t.conflictColor = "#DC2626";
      } else if (arrivalMin <= 40) {
        t.conflictLevel = "WARNING";
        t.conflictTag = "⚠️ APPROACHING BLOCK";
        t.conflictColor = "#F59E0B";
      } else {
        t.conflictLevel = "SAFE";
        t.conflictTag = "SAFE WINDOW";
        t.conflictColor = "#10B981";
      }
    });

    // Re-sort trains by arrival time
    this.currentData.trains.sort((a, b) => a.timeToArrivalMin - b.timeToArrivalMin);

    // Compute shifted recommendation
    const maxConflictTime = Math.max(...this.currentData.trains.map(t => t.timeToArrivalMin));
    const recStart = new Date(Date.now() + (maxConflictTime + 15) * 60 * 1000);
    const recEnd = new Date(Date.now() + (maxConflictTime + 75) * 60 * 1000);
    this.currentData.recommendedBlock = `${recStart.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} — ${recEnd.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} hrs`;
    this.currentData.recommendationRationale = `Shifted window: Commences 15 mins after Train ${this.currentData.trains[0].trainNumber} clears track point.`;
  },

  // ── When User Clicks the Track Problem ─────────────────────────────────────
  onProblemClick() {
    if (!this.currentData) {
      this.currentData = JSON.parse(JSON.stringify(this.DEFAULT_DATA[this.activeSection] || this.DEFAULT_DATA["RE-GGN"]));
    }

    const problem = this.currentData.problemPoint;
    const trains = this.currentData.trains;

    // 1. Draw the train running pointers on the track & start slow movement
    this.renderTrainRunningPointers(trains, problem);

    // 2. Open and populate the comprehensive HUD
    this.populateProblemHud(this.currentData);

    // 3. Pan map smoothly to frame the defect and trains
    this.map.panTo([problem.lat, problem.lng], { animate: true, duration: 0.6 });
  },

  // ── Render Train Running Pointers & Start Slow Realistic Movement ───────────
  renderTrainRunningPointers(trains, problem) {
    this.stopTrainSlowMovement();
    this.layers.trainPointers.clearLayers();
    this.layers.vectors.clearLayers();
    this.activeTrainAnimations = [];

    if (!trains || !problem) return;

    trains.forEach((train, index) => {
      const startCoords = train.pointerCoords || [problem.lat + 0.03 * (index + 1), problem.lng + 0.03 * (index + 1)];
      const isCritical = train.conflictLevel === "CRITICAL";
      const isWarning = train.conflictLevel === "WARNING";
      const modifierClass = isCritical ? "critical" : (isWarning ? "warning" : "safe");

      // Stagger badge positions so nearby train labels NEVER overlap
      const posClasses = ["badge-pos-top", "badge-pos-bottom", "badge-pos-left", "badge-pos-right"];
      const posClass = posClasses[index % posClasses.length];

      // Draw connection trajectory line from train to track problem
      const vectorLine = L.polyline([startCoords, [problem.lat, problem.lng]], {
        color: train.conflictColor || "#38BDF8",
        weight: isCritical ? 2.5 : 1.5,
        opacity: 0.8,
        dashArray: "6 6"
      }).addTo(this.layers.vectors);

      const pointerHtml = `
        <div class="train-pointer-wrapper" id="trainWrapper_${train.trainNumber}" title="${train.trainNumber} ${train.trainName} • ${train.timeToArrivalMin}m to Defect">
          <div class="train-pointer-badge ${modifierClass} ${posClass}" id="trainBadge_${train.trainNumber}">
            🚆 ${train.trainNumber} • ${train.timeToArrivalMin}m
          </div>
          <div class="train-pointer-icon ${modifierClass}" id="trainIcon_${train.trainNumber}">
            ▲
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'train-pointer-div-icon',
        html: pointerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const trainMarker = L.marker(startCoords, { icon }).addTo(this.layers.trainPointers);

      const makePopupContent = (curMin) => `
        <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: #0F172A; font-size: 13.5px;">${train.trainNumber} ${train.trainName}</strong>
            <span style="background:${train.conflictColor};color:white;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;">
              ${train.conflictTag}
            </span>
          </div>
          <div style="font-size: 11.5px; color: #475569; margin-bottom: 4px;">
            Current Station: <strong>${train.currentStation}</strong> • Speed: <strong>${train.speedKmH} km/h</strong>
          </div>
          <div style="background: #F1F5F9; border-radius: 6px; padding: 6px 8px; font-size: 11.5px; font-weight: 700; color: #0284C7; margin-bottom: 6px;">
            ⏱️ Time to Track Defect: ${curMin} mins (ETA ${train.arrivalEta})
          </div>
          <div style="font-size: 10.5px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 4px;">
            <div>📍 <strong>Real-World API:</strong> Static station fix (${train.currentStationCode})</div>
            <div>🚆 <strong>Map Visualizer:</strong> Continuous slow track progression towards defect</div>
          </div>
        </div>
      `;

      trainMarker.bindPopup(makePopupContent(train.timeToArrivalMin));

      // Build path segments along the track from train origin to problem location
      const subPath = this.buildSubPathAlongTrack(startCoords, [problem.lat, problem.lng]);

      // Realistic automatic block headway limit: trains hold at successive signals before block
      const maxProgress = Math.max(0.25, 0.80 - index * 0.22);

      this.activeTrainAnimations.push({
        train,
        marker: trainMarker,
        vectorLine,
        subPath,
        currentProgress: 0.0,
        maxProgress,
        currentMinutes: train.timeToArrivalMin,
        // Calibrated realistic railway speed: gentle and observable motion along the track
        speedStep: 0.00030 * (train.speedKmH / 100),
        makePopupContent
      });
    });

    // Start the continuous slow motion along the track line
    this.startTrainSlowMovement(problem);
  },

  // ── Build Path Along Track Vertices between Two Points ──────────────────────
  buildSubPathAlongTrack(startPt, endPt) {
    if (!this.trackCoords || this.trackCoords.length < 2) {
      return [startPt, endPt];
    }

    const snapStart = this.snapPointToTrack({ lat: startPt[0], lng: startPt[1] });
    const snapEnd = this.snapPointToTrack({ lat: endPt[0], lng: endPt[1] });

    let i1 = 0, i2 = 0;
    let d1 = Infinity, d2 = Infinity;

    for (let i = 0; i < this.trackCoords.length; i++) {
      const distStart = this.haversineKm(snapStart.lat, snapStart.lng, this.trackCoords[i][0], this.trackCoords[i][1]);
      if (distStart < d1) { d1 = distStart; i1 = i; }
      const distEnd = this.haversineKm(snapEnd.lat, snapEnd.lng, this.trackCoords[i][0], this.trackCoords[i][1]);
      if (distEnd < d2) { d2 = distEnd; i2 = i; }
    }

    const path = [[snapStart.lat, snapStart.lng]];
    if (i1 < i2) {
      for (let k = i1; k <= i2; k++) path.push(this.trackCoords[k]);
    } else {
      for (let k = i1; k >= i2; k--) path.push(this.trackCoords[k]);
    }
    path.push([snapEnd.lat, snapEnd.lng]);

    return path;
  },

  // ── Slow Continuous Motion Animation Engine ────────────────────────────────
  startTrainSlowMovement(problem) {
    if (this.trainAnimationTimer) clearInterval(this.trainAnimationTimer);

    // Frame update every 250ms for realistic, gentle railway progression
    this.trainAnimationTimer = setInterval(() => {
      this.activeTrainAnimations.forEach(anim => {
        // Advance progress until signal headway stopping limit is reached
        if (anim.currentProgress < anim.maxProgress) {
          anim.currentProgress += anim.speedStep;
        }

        // Interpolate position along subPath
        const pos = this.interpolateAlongPath(anim.subPath, anim.currentProgress);
        anim.marker.setLatLng(pos);

        // Update trajectory line to defect
        anim.vectorLine.setLatLngs([pos, [problem.lat, problem.lng]]);

        // Calculate slow countdown of remaining minutes
        const isHeld = anim.currentProgress >= anim.maxProgress;
        const remainingMin = Math.max(2, Math.round(anim.train.timeToArrivalMin * (1 - anim.currentProgress * 0.85)));
        const badgeEl = document.getElementById(`trainBadge_${anim.train.trainNumber}`);
        if (badgeEl) {
          if (isHeld) {
            badgeEl.innerHTML = `🛑 ${anim.train.trainNumber} • ${remainingMin}m`;
            badgeEl.title = `Train ${anim.train.trainNumber} held at automatic signal before maintenance block`;
          } else {
            badgeEl.innerHTML = `🚆 ${anim.train.trainNumber} • ${remainingMin}m`;
          }
        }

        // Update popup if open
        if (anim.marker.isPopupOpen()) {
          anim.marker.setPopupContent(anim.makePopupContent(remainingMin));
        }
      });
    }, 250);
  },

  stopTrainSlowMovement() {
    if (this.trainAnimationTimer) {
      clearInterval(this.trainAnimationTimer);
      this.trainAnimationTimer = null;
    }
    this.activeTrainAnimations = [];
  },

  interpolateAlongPath(path, fraction) {
    if (!path || path.length === 0) return [28.3848, 76.8623];
    if (path.length === 1 || fraction <= 0) return path[0];
    if (fraction >= 1) return path[path.length - 1];

    // Compute total length
    let totalLen = 0;
    const segLens = [];
    for (let i = 0; i < path.length - 1; i++) {
      const len = this.haversineKm(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);
      segLens.push(len);
      totalLen += len;
    }

    const targetDist = fraction * totalLen;
    let accumulated = 0;

    for (let i = 0; i < segLens.length; i++) {
      if (accumulated + segLens[i] >= targetDist) {
        const segFrac = segLens[i] === 0 ? 0 : (targetDist - accumulated) / segLens[i];
        const lat = path[i][0] + segFrac * (path[i+1][0] - path[i][0]);
        const lng = path[i][1] + segFrac * (path[i+1][1] - path[i][1]);
        return [lat, lng];
      }
      accumulated += segLens[i];
    }

    return path[path.length - 1];
  },

  // ── Populate Track Problem HUD ─────────────────────────────────────────────
  populateProblemHud(data) {
    const hud = document.getElementById("trackProblemHud");
    if (!hud) return;

    hud.style.display = "flex";
    hud.classList.remove("minimized");
    const minHudBtn = document.getElementById("minimizeProblemHudBtn");
    if (minHudBtn) {
      minHudBtn.textContent = "_";
      minHudBtn.title = "Minimize HUD";
    }

    const prob = data.problemPoint;
    const trains = data.trains || [];

    // Header info
    const titleEl = document.getElementById("tphTitle");
    const subtitleEl = document.getElementById("tphSubtitle");
    const blockTimeEl = document.getElementById("tphBlockTime");
    const blockDescEl = document.getElementById("tphBlockDesc");
    const countEl = document.getElementById("tphTrafficCount");
    const listEl = document.getElementById("tphTrainsList");
    const recWindowEl = document.getElementById("tphRecWindow");
    const recDescEl = document.getElementById("tphRecDesc");
    const advisoryEl = document.getElementById("tphRoleAdvisory");

    if (titleEl) titleEl.textContent = `⚠️ TRACK DEFECT: ${prob.type}`;
    if (subtitleEl) subtitleEl.textContent = `${prob.milepost} • ${data.sectionName}`;
    if (blockTimeEl) blockTimeEl.textContent = `${prob.proposedBlockWindow} (Proposed Possession)`;
    if (blockDescEl) blockDescEl.textContent = prob.description;
    if (countEl) countEl.textContent = `${trains.length} Approaching Trains Analyzed`;

    if (recWindowEl) recWindowEl.textContent = data.recommendedBlock;
    if (recDescEl) recDescEl.textContent = data.recommendationRationale;
    if (advisoryEl) advisoryEl.textContent = data.levelAdvisory;

    // Populate approaching trains list
    if (listEl) {
      listEl.innerHTML = "";
      trains.forEach(t => {
        const card = document.createElement("div");
        const modClass = t.conflictLevel === "CRITICAL" ? "critical" : (t.conflictLevel === "WARNING" ? "warning" : "safe");
        card.className = `tph-train-card ${modClass}`;
        card.innerHTML = `
          <div class="tph-train-top">
            <div class="tph-train-id">🚆 ${t.trainNumber} — ${t.trainName}</div>
            <span class="tph-train-tag ${modClass}">${t.conflictTag}</span>
          </div>
          <div class="tph-train-meta">
            <span>📍 API Fix: <strong>${t.currentStation} (Static)</strong></span>
            <span>⚡ Speed: <strong>${t.speedKmH} km/h</strong></span>
            <span>⏱ Status: <strong>${t.status}</strong></span>
          </div>
          <div class="tph-arrival-badge">
            <span>Time to Track Defect:</span>
            <span class="tph-arrival-time">${t.timeToArrivalMin} mins (ETA ${t.arrivalEta})</span>
          </div>
        `;

        card.addEventListener('click', () => {
          if (t.pointerCoords) {
            this.map.panTo(t.pointerCoords, { animate: true, duration: 0.5 });
          }
        });

        listEl.appendChild(card);
      });
    }

    hud.style.display = "flex";
  },

  // ── Auto-Refresh Countdown & Telemetry Stream ──────────────────────────────
  startAutoRefresh() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.secondsToNextRefresh = 60;

    this.countdownInterval = setInterval(() => {
      this.secondsToNextRefresh--;
      if (this.secondsToNextRefresh <= 0) {
        this.secondsToNextRefresh = 60;
        this.fetchCorridorTelemetry();
      }
      const clockEl = document.getElementById("mapStreamClock");
      if (clockEl && this.currentData) {
        clockEl.textContent = `• Updated: ${this.currentData.lastRefreshed} (Next: ${this.secondsToNextRefresh}s)`;
      }
    }, 1000);
  },

  // ── Initialize Event Listeners & Controls ──────────────────────────────────
  initControls() {
    if (this._controlsInitialized) return;
    this._controlsInitialized = true;

    // Theme selector
    const themeSelect = document.getElementById("mapThemeSelector");
    if (themeSelect) {
      themeSelect.addEventListener("change", () => {
        this.setTheme(themeSelect.value);
      });
    }

    // Section / Corridor selector
    const sectionSelect = document.getElementById("mapSectionSelector");
    if (sectionSelect) {
      if (this.activeSection) {
        sectionSelect.value = this.activeSection;
      }
      sectionSelect.addEventListener("change", () => {
        const hud = document.getElementById("trackProblemHud");
        if (hud) hud.style.display = "none";
        this.loadSection(sectionSelect.value);
      });
    }

    // Completely isolate trackProblemHud container from Leaflet map click bubbling
    const hud = document.getElementById("trackProblemHud");
    if (hud) {
      if (typeof L !== "undefined" && L.DomEvent) {
        L.DomEvent.disableClickPropagation(hud);
        L.DomEvent.disableScrollPropagation(hud);
      }
      ["click", "dblclick", "mousedown", "mouseup", "pointerdown", "pointerup", "touchstart", "touchend"].forEach(evt => {
        hud.addEventListener(evt, (e) => {
          e.stopPropagation();
        });
      });
    }

    // Close HUD button — stop all propagation and suppress track click re-triggering
    const closeHudBtn = document.getElementById("closeProblemHudBtn");
    if (closeHudBtn) {
      const handleClose = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (typeof L !== "undefined" && L.DomEvent) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
          }
        }

        // Suppress any stray or simulated clicks from immediately re-opening conflicts
        this._suppressTrackClicks = true;
        setTimeout(() => {
          this._suppressTrackClicks = false;
        }, 600);

        const hudEl = document.getElementById("trackProblemHud");
        if (hudEl) hudEl.style.display = "none";
        this.stopTrainSlowMovement();
        this.layers.trainPointers.clearLayers();
        this.layers.vectors.clearLayers();
      };

      closeHudBtn.addEventListener("click", handleClose);
      closeHudBtn.addEventListener("mousedown", (e) => e.stopPropagation());
      closeHudBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
    }

    // Minimize / Expand HUD button
    const minHudBtn = document.getElementById("minimizeProblemHudBtn");
    if (minHudBtn) {
      minHudBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof L !== "undefined" && L.DomEvent) {
          L.DomEvent.stopPropagation(e);
        }
        const hudEl = document.getElementById("trackProblemHud");
        if (!hudEl) return;
        hudEl.classList.toggle("minimized");
        minHudBtn.textContent = hudEl.classList.contains("minimized") ? "▾" : "_";
        minHudBtn.title = hudEl.classList.contains("minimized") ? "Expand HUD" : "Minimize HUD";
      });
      minHudBtn.addEventListener("mousedown", (e) => e.stopPropagation());
      minHudBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
    }

    // Refresh telemetry button
    const refreshBtn = document.getElementById("mapRefreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = `<span>Refreshing API...</span>`;
        await this.fetchCorridorTelemetry();
        setTimeout(() => {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            <span>Refresh Live Data</span>
          `;
        }, 500);
      });
    }

    // HUD internal refresh button
    const tphRefreshBtn = document.getElementById("tphRefreshBtn");
    if (tphRefreshBtn) {
      tphRefreshBtn.addEventListener("click", (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        this.fetchCorridorTelemetry();
      });
    }

    // Adopt Recommended Block button
    const adoptBtn = document.getElementById("tphAdoptBtn");
    if (adoptBtn) {
      adoptBtn.addEventListener("click", (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!this.currentData) return;
        const rec = this.currentData.recommendedBlock;
        if (typeof showToast === "function") {
          showToast(`Recommended Block Window adopted: ${rec}. Transferred to Block Planner.`);
        }
        if (typeof switchTab === "function") {
          switchTab("tab-planner");
        }
      });
    }
  },

  // ── Cleanup ────────────────────────────────────────────────────────────────
  destroy() {
    this.stopTrainSlowMovement();
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
};
