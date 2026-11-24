(function () {
  "use strict";

  // Configurable reply-to email (defaults to empty string until isolated custom domain is finalized;
  // supports ?reply=<email> query param override)
  var CONFIG = {
    RESERVATION_EMAIL: "",
    FLAT_FEE: 1195,
    BASIS_ANNUAL: 14988,
    HARD_DEADLINE_DAYS: 730,
    LOCKOUT_MAX_DAYS: 40,
    CRITICAL_REMAINING_DAYS: 90,
    SOI_WARNING_TEXT:
      "Accepting an Amazon Vendor Central Statement of Open Items (SOI) bulk settlement permanently waives your right to dispute or recover all other open items in that time period."
  };

  function resolveReservationEmail() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      var q = (params.get("reply") || "").trim();
      if (q && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) {
        return q;
      }
    } catch (_) {
      // ignore URLSearchParams errors in restricted environments
    }
    return CONFIG.RESERVATION_EMAIL || "";
  }

  // Exact mirror of engine/demo_dataset.json ($184,620 Gross PQV)
  var DEFAULT_DEMO_DATA = {
    datasetName: "Redacted US Home & Kitchen 1P Sample ($184,620 Gross PQV)",
    auditDate: "2026-11-24",
    remittance: [
      { "Invoice Number": "INV-90112", "PO Number": "PO-48219011", "Invoice Date": "2026-01-05", "Amount": -9420.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ONT8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-90112-SCR", "PO Number": "PO-48219011", "Invoice Date": "2026-02-18", "Amount": 9420.00, "Invoice Type": "Shortage Claim Reversal (-SCR)", "FC Code": "ONT8", "Prior Dispute Status": "REVERSED" },
      { "Invoice Number": "INV-90245", "PO Number": "PO-48224508", "Invoice Date": "2026-01-19", "Amount": -7860.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "FTW1", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-90245-SCR", "PO Number": "PO-48224508", "Invoice Date": "2026-03-04", "Amount": 7860.00, "Invoice Type": "Shortage Claim Reversal (-SCR)", "FC Code": "FTW1", "Prior Dispute Status": "REVERSED" },
      { "Invoice Number": "INV-90381", "PO Number": "PO-48231940", "Invoice Date": "2026-02-02", "Amount": -5600.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "ABE8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-90381-SCR", "PO Number": "PO-48231940", "Invoice Date": "2026-03-21", "Amount": 5600.00, "Invoice Type": "Shortage Claim Reversal (-SCR)", "FC Code": "ABE8", "Prior Dispute Status": "REVERSED" },
      { "Invoice Number": "INV-90418", "PO Number": "PO-48236112", "Invoice Date": "2026-01-10", "Amount": -12480.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "MDW2", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-90418-SCR", "PO Number": "PO-48236112", "Invoice Date": "2026-02-26", "Amount": 3600.00, "Invoice Type": "Shortage Claim Reversal (-SCR Partial)", "FC Code": "MDW2", "Prior Dispute Status": "REVERSED" },
      { "Invoice Number": "INV-78412", "PO Number": "PO-46109244", "Invoice Date": "2024-12-12", "Amount": -11450.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ONT8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-79105", "PO Number": "PO-46148810", "Invoice Date": "2024-12-31", "Amount": -9680.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "TEB9", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-79844", "PO Number": "PO-46192305", "Invoice Date": "2025-01-17", "Amount": -7940.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "FTW1", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-80519", "PO Number": "PO-46241788", "Invoice Date": "2025-02-11", "Amount": -5750.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "CLT2", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-83190", "PO Number": "PO-47051120", "Invoice Date": "2025-05-31", "Amount": -8920.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ABE8", "Prior Dispute Status": "PRIOR_REJECTED" },
      { "Invoice Number": "INV-84712", "PO Number": "PO-47189402", "Invoice Date": "2025-07-27", "Amount": -7140.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "SMF3", "Prior Dispute Status": "SOI_OFFERED" },
      { "Invoice Number": "INV-86041", "PO Number": "PO-47310655", "Invoice Date": "2025-09-22", "Amount": -5580.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "MDW2", "Prior Dispute Status": "PRIOR_REJECTED" },
      { "Invoice Number": "INV-91204", "PO Number": "PO-48412095", "Invoice Date": "2026-02-23", "Amount": -11840.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ONT8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-92088", "PO Number": "PO-48590411", "Invoice Date": "2026-04-26", "Amount": -9760.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "FTW1", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-93115", "PO Number": "PO-48744230", "Invoice Date": "2026-06-29", "Amount": -8450.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "TEB9", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-94260", "PO Number": "PO-48901577", "Invoice Date": "2026-08-27", "Amount": -7060.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "CLT2", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-80112", "PO Number": "PO-46215904", "Invoice Date": "2025-01-25", "Amount": -6840.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ABE8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-87904", "PO Number": "PO-47620819", "Invoice Date": "2025-10-28", "Amount": -7420.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "SMF3", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-89650", "PO Number": "PO-48105432", "Invoice Date": "2025-12-24", "Amount": -6190.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "MDW2", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-92641", "PO Number": "PO-48673120", "Invoice Date": "2026-06-01", "Amount": -4810.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ONT8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-93822", "PO Number": "PO-48832914", "Invoice Date": "2026-08-04", "Amount": -3680.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "TEB9", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-75108", "PO Number": "PO-45810233", "Invoice Date": "2024-10-31", "Amount": -8640.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "FTW1", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-74290", "PO Number": "PO-45692014", "Invoice Date": "2024-09-03", "Amount": -5650.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ABE8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-95410", "PO Number": "PO-49104288", "Invoice Date": "2026-10-19", "Amount": -5120.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "ONT8", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-95892", "PO Number": "PO-49158711", "Invoice Date": "2026-10-31", "Amount": -4190.00, "Invoice Type": "PQV Shortage Claim", "FC Code": "MDW2", "Prior Dispute Status": "OPEN" },
      { "Invoice Number": "INV-96145", "PO Number": "PO-49203940", "Invoice Date": "2026-11-12", "Amount": -3150.00, "Invoice Type": "Quantity Variance Shortage", "FC Code": "CLT2", "Prior Dispute Status": "OPEN" }
    ],
    podIndex: [
      { "PO Number": "PO-48219011", "BOL Number": "BOL-2026-0102-881", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-48219011", "Delivery Date": "2026-01-03", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48219011_ONT8_STAMPED.pdf", "Units Shipped": 420, "Units Invoiced": 420 },
      { "PO Number": "PO-48224508", "BOL Number": "BOL-2026-0115-442", "Carrier": "Estes Express Lines (EXLA)", "ASN Number": "ASN-856-48224508", "Delivery Date": "2026-01-17", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48224508_FTW1_STAMPED.pdf", "Units Shipped": 360, "Units Invoiced": 360 },
      { "PO Number": "PO-48231940", "BOL Number": "BOL-2026-0129-119", "Carrier": "XPO Logistics (CNWY)", "ASN Number": "ASN-856-48231940", "Delivery Date": "2026-01-31", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48231940_ABE8_STAMPED.pdf", "Units Shipped": 280, "Units Invoiced": 280 },
      { "PO Number": "PO-48236112", "BOL Number": "BOL-2026-0107-504", "Carrier": "Saia LTL Freight (SAIA)", "ASN Number": "ASN-856-48236112", "Delivery Date": "2026-01-08", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48236112_MDW2_STAMPED.pdf", "Units Shipped": 540, "Units Invoiced": 540 },
      { "PO Number": "PO-46109244", "BOL Number": "BOL-2024-1208-309", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-46109244", "Delivery Date": "2024-12-10", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-46109244_ONT8_STAMPED.pdf", "Units Shipped": 520, "Units Invoiced": 520 },
      { "PO Number": "PO-46148810", "BOL Number": "BOL-2024-1227-718", "Carrier": "Estes Express Lines (EXLA)", "ASN Number": "ASN-856-46148810", "Delivery Date": "2024-12-29", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-46148810_TEB9_STAMPED.pdf", "Units Shipped": 440, "Units Invoiced": 440 },
      { "PO Number": "PO-46192305", "BOL Number": "BOL-2025-0113-902", "Carrier": "ABF Freight (ABFS)", "ASN Number": "ASN-856-46192305", "Delivery Date": "2025-01-15", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-46192305_FTW1_STAMPED.pdf", "Units Shipped": 380, "Units Invoiced": 380 },
      { "PO Number": "PO-46241788", "BOL Number": "BOL-2025-0207-225", "Carrier": "R+L Carriers (RLCA)", "ASN Number": "ASN-856-46241788", "Delivery Date": "2025-02-09", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-46241788_CLT2_STAMPED.pdf", "Units Shipped": 290, "Units Invoiced": 290 },
      { "PO Number": "PO-47051120", "BOL Number": "BOL-2025-0526-614", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-47051120", "Delivery Date": "2025-05-29", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-47051120_ABE8_STAMPED.pdf", "Units Shipped": 410, "Units Invoiced": 410 },
      { "PO Number": "PO-47189402", "BOL Number": "BOL-2025-0723-331", "Carrier": "XPO Logistics (CNWY)", "ASN Number": "ASN-856-47189402", "Delivery Date": "2025-07-25", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-47189402_SMF3_STAMPED.pdf", "Units Shipped": 340, "Units Invoiced": 340 },
      { "PO Number": "PO-47310655", "BOL Number": "BOL-2025-0918-845", "Carrier": "Saia LTL Freight (SAIA)", "ASN Number": "ASN-856-47310655", "Delivery Date": "2025-09-20", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-47310655_MDW2_STAMPED.pdf", "Units Shipped": 275, "Units Invoiced": 275 },
      { "PO Number": "PO-48412095", "BOL Number": "BOL-2026-0219-770", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-48412095", "Delivery Date": "2026-02-21", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48412095_ONT8_STAMPED.pdf", "Units Shipped": 560, "Units Invoiced": 560 },
      { "PO Number": "PO-48590411", "BOL Number": "BOL-2026-0422-194", "Carrier": "Estes Express Lines (EXLA)", "ASN Number": "ASN-856-48590411", "Delivery Date": "2026-04-24", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48590411_FTW1_STAMPED.pdf", "Units Shipped": 465, "Units Invoiced": 465 },
      { "PO Number": "PO-48744230", "BOL Number": "BOL-2026-0625-512", "Carrier": "ABF Freight (ABFS)", "ASN Number": "ASN-856-48744230", "Delivery Date": "2026-06-27", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48744230_TEB9_STAMPED.pdf", "Units Shipped": 395, "Units Invoiced": 395 },
      { "PO Number": "PO-48901577", "BOL Number": "BOL-2026-0823-688", "Carrier": "R+L Carriers (RLCA)", "ASN Number": "ASN-856-48901577", "Delivery Date": "2026-08-25", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-48901577_CLT2_STAMPED.pdf", "Units Shipped": 330, "Units Invoiced": 330 },
      { "PO Number": "PO-46215904", "BOL Number": "BOL-2025-0121-403", "Carrier": "XPO Logistics (CNWY)", "ASN Number": "ASN-856-46215904", "Delivery Date": "2025-01-23", "POD Status": "SIGNED_NO_STAMP", "Signed POD Filename": "POD_PO-46215904_ABE8_NOSTAMP.pdf", "Units Shipped": 310, "Units Invoiced": 310 },
      { "PO Number": "PO-47620819", "BOL Number": "BOL-2025-1024-951", "Carrier": "UPS Freight / TForce (TFFC)", "ASN Number": "ASN-856-47620819", "Delivery Date": "2025-10-26", "POD Status": "UNSIGNED", "Signed POD Filename": "BOL_PO-47620819_UNSIGNED.pdf", "Units Shipped": 350, "Units Invoiced": 350 },
      { "PO Number": "PO-48105432", "BOL Number": "BOL-2025-1220-118", "Carrier": "FedEx Freight (FXFE)", "ASN Number": "ASN-856-48105432", "Delivery Date": "2025-12-22", "POD Status": "MISSING", "Signed POD Filename": "", "Units Shipped": 295, "Units Invoiced": 295 },
      { "PO Number": "PO-48673120", "BOL Number": "BOL-2026-0528-627", "Carrier": "Saia LTL Freight (SAIA)", "ASN Number": "ASN-856-48673120", "Delivery Date": "2026-05-30", "POD Status": "SIGNED_NO_STAMP", "Signed POD Filename": "POD_PO-48673120_ONT8_NOSTAMP.pdf", "Units Shipped": 240, "Units Invoiced": 240 },
      { "PO Number": "PO-48832914", "BOL Number": "BOL-2026-0801-209", "Carrier": "Central Transport (CTII)", "ASN Number": "", "Delivery Date": "2026-08-03", "POD Status": "MISSING", "Signed POD Filename": "", "Units Shipped": 185, "Units Invoiced": 185 },
      { "PO Number": "PO-45810233", "BOL Number": "BOL-2024-1027-441", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-45810233", "Delivery Date": "2024-10-29", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-45810233_FTW1_STAMPED.pdf", "Units Shipped": 400, "Units Invoiced": 400 },
      { "PO Number": "PO-45692014", "BOL Number": "BOL-2024-0830-812", "Carrier": "Estes Express Lines (EXLA)", "ASN Number": "ASN-856-45692014", "Delivery Date": "2024-09-01", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-45692014_ABE8_STAMPED.pdf", "Units Shipped": 265, "Units Invoiced": 265 },
      { "PO Number": "PO-49104288", "BOL Number": "BOL-2026-1015-904", "Carrier": "Old Dominion Freight Line (ODFL)", "ASN Number": "ASN-856-49104288", "Delivery Date": "2026-10-17", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-49104288_ONT8_STAMPED.pdf", "Units Shipped": 250, "Units Invoiced": 250 },
      { "PO Number": "PO-49158711", "BOL Number": "BOL-2026-1027-315", "Carrier": "Saia LTL Freight (SAIA)", "ASN Number": "ASN-856-49158711", "Delivery Date": "2026-10-29", "POD Status": "SIGNED_STAMPED", "Signed POD Filename": "POD_PO-49158711_MDW2_STAMPED.pdf", "Units Shipped": 210, "Units Invoiced": 210 },
      { "PO Number": "PO-49203940", "BOL Number": "BOL-2026-1109-112", "Carrier": "Estes Express Lines (EXLA)", "ASN Number": "ASN-856-49203940", "Delivery Date": "2026-11-10", "POD Status": "UNSIGNED", "Signed POD Filename": "", "Units Shipped": 160, "Units Invoiced": 160 }
    ]
  };

  var REMITTANCE_ALIASES = {
    invoice_number: ["invoice number", "invoice #", "invoice no", "invoice id", "deduction id", "deduction number", "deduction #", "document number", "claim id", "remittance invoice", "invoice"],
    po_number: ["po number", "po #", "po no", "purchase order", "purchase order number", "purchase order #", "po", "amazon po", "3pl po number"],
    invoice_date: ["invoice date", "deduction date", "payment date", "shortage date", "claim date", "remittance date", "date"],
    amount: ["amount", "shortage amount", "deduction amount", "pqv amount", "claim amount", "net amount", "balance", "amount paid", "variance amount", "open amount", "net shortage"],
    invoice_type: ["invoice type", "description", "deduction type", "reason", "reason code", "type", "category", "claim type"],
    fc_code: ["fc code", "fc", "fulfillment center", "destination fc", "warehouse"],
    prior_dispute_status: ["prior dispute status", "dispute status", "claim status", "prior status", "status", "soi status", "prior rejected", "notes"]
  };

  var POD_ALIASES = {
    po_number: ["po number", "3pl po number", "purchase order", "purchase order number", "po #", "po no", "po", "amazon po"],
    bol_number: ["bol number", "bol #", "bol no", "bill of lading", "bol", "master bol"],
    carrier: ["carrier", "carrier name", "scac", "freight carrier", "ltl carrier"],
    asn_number: ["asn number", "asn #", "asn no", "asn", "shipment id", "edi 856", "edi 856 asn"],
    delivery_date: ["delivery date", "delivered date", "pod date", "arrival date", "ship date"],
    pod_status: ["pod status", "proof of delivery status", "signature status", "delivery proof status", "pod", "status"],
    signed_pod_filename: ["signed pod filename", "pod filename", "pod file", "document filename", "filename", "pod pdf"],
    units_shipped: ["units shipped", "shipped qty", "qty shipped", "shipped units", "quantity shipped"],
    units_invoiced: ["units invoiced", "invoiced qty", "qty invoiced", "invoiced units", "quantity invoiced"]
  };

  var PRIOR_REJECTED_OR_SOI_STATUSES = {
    PRIOR_REJECTED: true,
    REJECTED: true,
    DENIED: true,
    SOI_OFFERED: true,
    SOI_RISK: true,
    REDISPUTE: true,
    RE_DISPUTE: true,
    STALE_OPEN: true
  };

  var state = {
    uploadedRemittanceText: null,
    uploadedPodText: null,
    lastReport: null,
    activeFilter: "ALL",
    reservationEmail: resolveReservationEmail()
  };

  function $(id) {
    return document.getElementById(id);
  }

  function formatUSD(val, decimals) {
    var d = typeof decimals === "number" ? decimals : 0;
    var neg = val < 0;
    var abs = Math.abs(val);
    var formatted = abs.toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d
    });
    return (neg ? "-$" : "$") + formatted;
  }

  function normCol(name) {
    return String(name || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9#]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildColumnMap(headers, aliasSpec) {
    var normToOrig = {};
    headers.forEach(function (h) {
      if (h === null || h === undefined) return;
      var n = normCol(h);
      if (n && !normToOrig[n]) {
        normToOrig[n] = String(h);
      }
    });
    var colMap = {};
    Object.keys(aliasSpec).forEach(function (canonical) {
      var candidates = [canonical.replace(/_/g, " ")].concat(aliasSpec[canonical]);
      for (var i = 0; i < candidates.length; i++) {
        var nc = normCol(candidates[i]);
        if (normToOrig[nc]) {
          colMap[canonical] = normToOrig[nc];
          break;
        }
      }
    });
    return colMap;
  }

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var clean = String(text || "").replace(/^\uFEFF/, "");

    for (var i = 0; i < clean.length; i++) {
      var ch = clean[i];
      var next = clean[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          row.push(field.trim());
          field = "";
        } else if (ch === "\r" && next === "\n") {
          row.push(field.trim());
          if (row.some(function (c) { return c !== ""; })) rows.push(row);
          row = [];
          field = "";
          i++;
        } else if (ch === "\n" || ch === "\r") {
          row.push(field.trim());
          if (row.some(function (c) { return c !== ""; })) rows.push(row);
          row = [];
          field = "";
        } else {
          field += ch;
        }
      }
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field.trim());
      if (row.some(function (c) { return c !== ""; })) rows.push(row);
    }

    if (rows.length < 2) {
      throw new Error("CSV file must include a header row and at least one data row.");
    }

    var headers = rows[0];
    var records = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        obj[headers[c]] = rows[r][c] !== undefined ? rows[r][c] : "";
      }
      records.push(obj);
    }
    return records;
  }

  function parseMoney(raw) {
    if (typeof raw === "number") return raw;
    var s = String(raw || "").trim();
    if (!s) return 0;
    var isNeg = false;
    if (s.startsWith("(") && s.endsWith(")")) {
      isNeg = true;
      s = s.slice(1, -1).trim();
    }
    s = s.replace(/[$,\s]|USD/gi, "");
    if (s.startsWith("-")) {
      isNeg = !isNeg;
      s = s.slice(1).trim();
    } else if (s.startsWith("+")) {
      s = s.slice(1).trim();
    }
    var n = parseFloat(s);
    if (isNaN(n)) return 0;
    return isNeg ? -n : n;
  }

  function parseIntOpt(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === "") return null;
    var n = parseInt(String(raw).replace(/,/g, "").trim(), 10);
    return isNaN(n) ? null : n;
  }

  function parseDateISO(raw) {
    var s = String(raw || "").trim();
    if (!s) return null;
    if (s.indexOf("T") !== -1) s = s.split("T")[0];
    var iso = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(s);
    if (iso) {
      return new Date(Date.UTC(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10)));
    }
    var us = /^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/.exec(s);
    if (us) {
      var yr = parseInt(us[3], 10);
      if (yr < 100) yr += 2000;
      return new Date(Date.UTC(yr, parseInt(us[1], 10) - 1, parseInt(us[2], 10)));
    }
    var parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
    }
    return null;
  }

  function daysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    return Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
  }

  function normalizePodStatus(raw) {
    var s = String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    if (!s || s === "MISSING" || s === "NONE" || s === "N_A" || s === "NA" || s === "NOT_FOUND" || s === "EMPTY") {
      return "MISSING";
    }
    if (s === "SIGNED_STAMPED" || s === "SIGNED_AND_STAMPED" || s === "STAMPED_SIGNED" || s === "STAMPED" || s === "HARD_POD" || s === "VERIFIED_STAMPED") {
      return "SIGNED_STAMPED";
    }
    if (s === "SIGNED_NO_STAMP" || s === "SIGNED_UNSTAMPED" || s === "NO_STAMP" || s === "SIGNED_ONLY" || s === "UNSTAMPED") {
      return "SIGNED_NO_STAMP";
    }
    if (s === "UNSIGNED" || s === "NOT_SIGNED" || s === "NO_SIGNATURE" || s === "PENDING" || s === "BLANK") {
      return "UNSIGNED";
    }
    return s;
  }

  function isScrRow(inv, invType) {
    if (/(?:[-_\s]?SCR\d*)$/i.test(inv)) return true;
    var t = " " + String(invType || "").toLowerCase() + " ";
    var kws = ["-scr", "scr ", " scr", "shortage claim reversal", "auto-repayment", "auto repayment", "repayment", "reversal", "credit memo"];
    for (var i = 0; i < kws.length; i++) {
      if (t.indexOf(kws[i]) !== -1) return true;
    }
    return false;
  }

  function invoiceRoot(inv) {
    return String(inv || "").replace(/(?:[-_\s]?SCR\d*)$/i, "").trim().toUpperCase();
  }

  function normalizeRemittanceRows(rawRows) {
    if (!rawRows || rawRows.length === 0) return [];
    var headers = [];
    rawRows.forEach(function (row) {
      Object.keys(row).forEach(function (k) {
        if (headers.indexOf(k) === -1) headers.push(k);
      });
    });
    var cmap = buildColumnMap(headers, REMITTANCE_ALIASES);
    var required = ["invoice_number", "po_number", "invoice_date", "amount"];
    var missing = required.filter(function (r) { return !cmap[r]; });
    if (missing.length > 0) {
      throw new Error("Remittance CSV missing required column(s): " + missing.join(", "));
    }

    var out = [];
    rawRows.forEach(function (row) {
      var inv = String(row[cmap.invoice_number] || "").trim().toUpperCase();
      var po = String(row[cmap.po_number] || "").trim().toUpperCase();
      if (!inv && !po) return;
      var dateStr = String(row[cmap.invoice_date] || "").trim();
      var invDate = parseDateISO(dateStr);
      var amt = parseMoney(row[cmap.amount]);
      var invType = String((cmap.invoice_type && row[cmap.invoice_type]) || "").trim();
      var fcCode = String((cmap.fc_code && row[cmap.fc_code]) || "").trim().toUpperCase() || "N/A";
      var priorRaw = String((cmap.prior_dispute_status && row[cmap.prior_dispute_status]) || "").trim().toUpperCase();
      var priorStatus = priorRaw.replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "OPEN";
      var scr = isScrRow(inv, invType);
      out.push({
        invoiceNumber: inv,
        invoiceRoot: invoiceRoot(inv),
        poNumber: po,
        invoiceDateStr: invDate ? invDate.toISOString().slice(0, 10) : dateStr,
        invoiceDate: invDate,
        absAmount: +Math.abs(amt).toFixed(2),
        invoiceType: invType || (scr ? "Shortage Claim Reversal (-SCR)" : "PQV Shortage Claim"),
        fcCode: fcCode,
        priorDisputeStatus: priorStatus,
        isScr: scr
      });
    });
    return out;
  }

  function normalizePodRows(rawRows) {
    if (!rawRows || rawRows.length === 0) return {};
    var headers = [];
    rawRows.forEach(function (row) {
      Object.keys(row).forEach(function (k) {
        if (headers.indexOf(k) === -1) headers.push(k);
      });
    });
    var cmap = buildColumnMap(headers, POD_ALIASES);
    if (!cmap.po_number) {
      throw new Error("3PL BOL/POD CSV missing required PO Number column.");
    }

    var podByPo = {};
    var statusRank = { SIGNED_STAMPED: 3, SIGNED_NO_STAMP: 2, UNSIGNED: 1, MISSING: 0 };

    rawRows.forEach(function (row) {
      var po = String(row[cmap.po_number] || "").trim().toUpperCase();
      if (!po) return;
      var rec = {
        poNumber: po,
        bolNumber: String((cmap.bol_number && row[cmap.bol_number]) || "").trim(),
        carrier: String((cmap.carrier && row[cmap.carrier]) || "").trim(),
        asnNumber: String((cmap.asn_number && row[cmap.asn_number]) || "").trim(),
        deliveryDate: String((cmap.delivery_date && row[cmap.delivery_date]) || "").trim(),
        podStatus: normalizePodStatus(cmap.pod_status && row[cmap.pod_status]),
        signedPodFilename: String((cmap.signed_pod_filename && row[cmap.signed_pod_filename]) || "").trim(),
        unitsShipped: parseIntOpt(cmap.units_shipped && row[cmap.units_shipped]),
        unitsInvoiced: parseIntOpt(cmap.units_invoiced && row[cmap.units_invoiced])
      };
      var existing = podByPo[po];
      if (!existing || (statusRank[rec.podStatus] || 0) >= (statusRank[existing.podStatus] || 0)) {
        podByPo[po] = rec;
      }
    });
    return podByPo;
  }

  function runPreAuditEngine(remittanceRecords, podRecords, auditDateStr, datasetLabel) {
    var auditDate = parseDateISO(auditDateStr) || new Date();
    var normRemit = normalizeRemittanceRows(remittanceRecords);
    var podByPo = normalizePodRows(podRecords);

    var shortages = normRemit.filter(function (r) { return !r.isScr; });
    var scrRows = normRemit.filter(function (r) { return r.isScr; });

    var byRoot = {};
    var byPo = {};
    var shortageState = shortages.map(function (s) {
      var item = {
        invoiceNumber: s.invoiceNumber,
        invoiceRoot: s.invoiceRoot,
        poNumber: s.poNumber,
        invoiceDateStr: s.invoiceDateStr,
        invoiceDate: s.invoiceDate,
        invoiceType: s.invoiceType,
        fcCode: s.fcCode,
        priorDisputeStatus: s.priorDisputeStatus,
        grossAmount: s.absAmount,
        scrReversed: 0,
        scrMatchedInvoices: []
      };
      if (!byRoot[item.invoiceRoot]) byRoot[item.invoiceRoot] = [];
      byRoot[item.invoiceRoot].push(item);
      if (!byPo[item.poNumber]) byPo[item.poNumber] = [];
      byPo[item.poNumber].push(item);
      return item;
    });

    // Two-pass -SCR reversal netting matching engine/pqv_preaudit.py
    scrRows.forEach(function (scr) {
      var creditRemaining = scr.absAmount;

      // Pass 1: invoice root
      var rootCands = byRoot[scr.invoiceRoot] || [];
      for (var i = 0; i < rootCands.length && creditRemaining > 0; i++) {
        var cand = rootCands[i];
        var openCap = +(cand.grossAmount - cand.scrReversed).toFixed(2);
        if (openCap <= 0) continue;
        var applyAmt = +Math.min(openCap, creditRemaining).toFixed(2);
        cand.scrReversed = +(cand.scrReversed + applyAmt).toFixed(2);
        cand.scrMatchedInvoices.push(scr.invoiceNumber);
        creditRemaining = +(creditRemaining - applyAmt).toFixed(2);
      }

      // Pass 2: PO fallback
      if (creditRemaining > 0) {
        var poCands = byPo[scr.poNumber] || [];
        for (var j = 0; j < poCands.length && creditRemaining > 0; j++) {
          var pc = poCands[j];
          var cap2 = +(pc.grossAmount - pc.scrReversed).toFixed(2);
          if (cap2 <= 0) continue;
          var apply2 = +Math.min(cap2, creditRemaining).toFixed(2);
          pc.scrReversed = +(pc.scrReversed + apply2).toFixed(2);
          pc.scrMatchedInvoices.push(scr.invoiceNumber);
          creditRemaining = +(creditRemaining - apply2).toFixed(2);
        }
      }
    });

    var totals = {
      gross: 0,
      grossCount: shortageState.length,
      scrReversed: 0,
      scrCount: scrRows.length,
      netOpen: 0,
      recoverableHardPod: 0,
      recoverableStandardM01: 0,
      recoverableM03Redispute: 0,
      recoverableCount: 0,
      redisputeCount: 0,
      criticalRescueHardPod: 0,
      criticalRescueOpen: 0,
      criticalHardPodCount: 0,
      weakExcluded: 0,
      weakCount: 0,
      initialLockout: 0,
      lockoutCount: 0,
      expired: 0,
      expiredCount: 0
    };

    var ledger = [];

    // Include -SCR credit rows in ledger view
    scrRows.forEach(function (scr) {
      ledger.push({
        invoiceNumber: scr.invoiceNumber,
        poNumber: scr.poNumber || "-",
        invoiceDate: scr.invoiceDateStr || "-",
        daysElapsed: null,
        daysRemaining: null,
        amount: scr.absAmount,
        podStatus: "AUTO_CREDIT",
        asnNumber: "-",
        classification: "SCR_REVERSED_CLOSED",
        ageBucket: "SCR_CREDIT",
        reason: "Amazon -SCR auto-repayment credit row netted against gross shortage."
      });
    });

    shortageState.forEach(function (item) {
      var grossAmt = item.grossAmount;
      var scrAmt = item.scrReversed;
      var netOpen = +(grossAmt - scrAmt).toFixed(2);

      totals.gross = +(totals.gross + grossAmt).toFixed(2);
      totals.scrReversed = +(totals.scrReversed + scrAmt).toFixed(2);
      totals.netOpen = +(totals.netOpen + netOpen).toFixed(2);

      var daysElapsed = item.invoiceDate ? Math.max(0, daysBetween(item.invoiceDate, auditDate)) : 0;
      var daysRemaining = CONFIG.HARD_DEADLINE_DAYS - daysElapsed;

      var ageBucket = "ACTIVE_DISPUTE";
      if (daysElapsed > CONFIG.HARD_DEADLINE_DAYS) {
        ageBucket = "EXPIRED";
      } else if (daysRemaining < CONFIG.CRITICAL_REMAINING_DAYS) {
        ageBucket = "CRITICAL_RESCUE";
      } else if (daysElapsed <= CONFIG.LOCKOUT_MAX_DAYS) {
        ageBucket = "INITIAL_LOCKOUT";
      }

      var pod = podByPo[item.poNumber] || null;
      var podStatus = pod ? pod.podStatus : "MISSING";
      var asnNumber = pod ? pod.asnNumber : "";
      var bolNumber = pod ? pod.bolNumber : "";
      var signedPodFilename = pod ? pod.signedPodFilename : "";
      var unitVariance =
        pod && pod.unitsShipped !== null && pod.unitsInvoiced !== null
          ? pod.unitsShipped - pod.unitsInvoiced
          : null;

      var failedReasons = [];
      if (!pod) {
        failedReasons.push("No matching 3PL BOL/POD row for PO");
      } else {
        if (!asnNumber) failedReasons.push("Missing EDI 856 ASN Number");
        if (podStatus !== "SIGNED_STAMPED") {
          failedReasons.push("POD status is " + podStatus + " (requires SIGNED_STAMPED)");
        }
        if (!signedPodFilename && !bolNumber) failedReasons.push("Missing signed POD filename and BOL reference");
        if (unitVariance !== null && unitVariance < 0) {
          failedReasons.push("Shipped units (" + pod.unitsShipped + ") < Invoiced units (" + pod.unitsInvoiced + ")");
        }
      }

      var hardPodVerified = failedReasons.length === 0;
      var isPriorRejectedOrSoi = !!PRIOR_REJECTED_OR_SOI_STATUSES[item.priorDisputeStatus];

      var classification = "";
      var reason = "";

      if (scrAmt > 0 && netOpen === 0) {
        classification = "SCR_REVERSED_CLOSED";
        reason = "Closed — already auto-reversed via Amazon -SCR credit (" + item.scrMatchedInvoices.join(", ") + ").";
      } else {
        if (ageBucket === "CRITICAL_RESCUE") {
          totals.criticalRescueOpen = +(totals.criticalRescueOpen + netOpen).toFixed(2);
        }

        if (ageBucket === "EXPIRED") {
          classification = "EXPIRED_PAST_730D";
          totals.expired = +(totals.expired + netOpen).toFixed(2);
          totals.expiredCount += 1;
          reason = "Do not dispute — past Amazon 730-day hard deadline (" + daysElapsed + "d elapsed).";
        } else if (ageBucket === "INITIAL_LOCKOUT") {
          classification = "INITIAL_LOCKOUT_WAIT";
          totals.initialLockout = +(totals.initialLockout + netOpen).toFixed(2);
          totals.lockoutCount += 1;
          var waitDays = CONFIG.LOCKOUT_MAX_DAYS + 1 - daysElapsed;
          reason = "Hold for Day 41 (" + waitDays + "d left in 0-40d initial reconciliation lockout).";
        } else if (hardPodVerified) {
          totals.recoverableHardPod = +(totals.recoverableHardPod + netOpen).toFixed(2);
          totals.recoverableCount += 1;
          if (ageBucket === "CRITICAL_RESCUE") {
            totals.criticalRescueHardPod = +(totals.criticalRescueHardPod + netOpen).toFixed(2);
            totals.criticalHardPodCount += 1;
          }
          if (isPriorRejectedOrSoi) {
            classification = "M-03_REDISPUTE_SOI_RISK";
            totals.recoverableM03Redispute = +(totals.recoverableM03Redispute + netOpen).toFixed(2);
            totals.redisputeCount += 1;
            reason = "File Re-Dispute with stamped POD packet. DO NOT accept an SOI bulk settlement covering this period.";
          } else {
            classification = ageBucket === "CRITICAL_RESCUE" ? "CRITICAL_RESCUE_HARD_POD" : "RECOVERABLE_HARD_POD";
            totals.recoverableStandardM01 = +(totals.recoverableStandardM01 + netOpen).toFixed(2);
            reason =
              ageBucket === "CRITICAL_RESCUE"
                ? "URGENT M-02 RESCUE: File Traditional Dispute immediately (" + daysRemaining + "d left before 730d cliff)."
                : "SIGNED_STAMPED POD + ASN + PO matched. Ready for <=10MB self-upload packet.";
          }
        } else {
          classification = "WEAK_EVIDENCE_EXCLUDED";
          totals.weakExcluded = +(totals.weakExcluded + netOpen).toFixed(2);
          totals.weakCount += 1;
          reason = "Stripped before charging: " + failedReasons.join("; ") + ".";
        }
      }

      ledger.push({
        invoiceNumber: item.invoiceNumber || "-",
        poNumber: item.poNumber || "-",
        invoiceDate: item.invoiceDateStr || "-",
        daysElapsed: daysElapsed,
        daysRemaining: daysRemaining,
        ageBucket: ageBucket,
        amount: netOpen > 0 ? netOpen : grossAmt,
        podStatus: podStatus,
        asnNumber: asnNumber || "-",
        classification: classification,
        reason: reason
      });
    });

    var rec = totals.recoverableHardPod;
    var chargeguardFee = rec <= 250000 ? rec * 0.25 : 250000 * 0.25 + (rec - 250000) * 0.15;
    var savingsVsAgency = chargeguardFee - CONFIG.FLAT_FEE;
    var netYieldPct = rec > 0 ? ((rec - CONFIG.FLAT_FEE) / rec) * 100 : 0;

    return {
      datasetLabel: datasetLabel,
      auditDate: auditDate.toISOString().slice(0, 10),
      totals: totals,
      roi: {
        flatFee: CONFIG.FLAT_FEE,
        chargeguardFee: +chargeguardFee.toFixed(2),
        basisAnnual: CONFIG.BASIS_ANNUAL,
        savingsVsAgency: +savingsVsAgency.toFixed(2),
        netYieldPct: +netYieldPct.toFixed(1)
      },
      ledger: ledger
    };
  }

  function renderReport(report) {
    state.lastReport = report;
    var t = report.totals;

    $("dataset-badge").textContent = report.datasetLabel + " · Audit Date: " + report.auditDate;
    $("kpi-gross").textContent = formatUSD(t.gross, 0);
    $("kpi-gross-count").textContent = t.grossCount + " gross shortage rows";
    $("kpi-scr").textContent = "-" + formatUSD(t.scrReversed, 0);
    $("kpi-scr-count").textContent = t.scrCount + " -SCR credit rows netted";
    $("kpi-excluded").textContent = formatUSD(t.weakExcluded, 0);
    $("kpi-excluded-count").textContent = t.weakCount + " weak/no-POD items stripped";
    $("kpi-critical").textContent = formatUSD(t.criticalRescueHardPod, 0);
    $("kpi-critical-count").textContent =
      t.criticalHardPodCount + " Hard-POD POs <90d (" + formatUSD(t.criticalRescueOpen, 0) + " total open <90d)";
    $("kpi-recoverable").textContent = formatUSD(t.recoverableHardPod, 0);
    $("kpi-recoverable-count").textContent = t.recoverableCount + " verified Hard-POD POs (M-01 + M-03)";

    $("rec-gross").textContent = formatUSD(t.gross, 2);
    $("rec-scr").textContent = "-" + formatUSD(t.scrReversed, 2);
    $("rec-net").textContent = formatUSD(t.netOpen, 2);
    $("rec-rec").textContent = formatUSD(t.recoverableStandardM01, 2);
    $("rec-redispute").textContent = formatUSD(t.recoverableM03Redispute, 2);
    $("rec-weak").textContent = formatUSD(t.weakExcluded, 2);
    $("rec-lockout").textContent = formatUSD(t.initialLockout, 2);
    $("rec-expired").textContent = formatUSD(t.expired, 2);

    var bucketSum = +(
      t.recoverableStandardM01 +
      t.recoverableM03Redispute +
      t.weakExcluded +
      t.initialLockout +
      t.expired
    ).toFixed(2);
    var diff = Math.abs(bucketSum - t.netOpen);
    $("identity-check-msg").textContent =
      diff < 0.05
        ? "Accounting check PASS: Gross (" +
          formatUSD(t.gross, 2) +
          ") - SCR (" +
          formatUSD(t.scrReversed, 2) +
          ") = Net Open (" +
          formatUSD(t.netOpen, 2) +
          ") == Bucket Sum (" +
          formatUSD(bucketSum, 2) +
          ")"
        : "Accounting delta: " + formatUSD(diff, 2);

    $("roi-chargeguard").textContent = formatUSD(report.roi.chargeguardFee, 2);
    $("roi-savings").textContent = formatUSD(report.roi.savingsVsAgency, 2);
    $("roi-yield").textContent = report.roi.netYieldPct.toFixed(1) + "%";
    $("soi-at-risk-inline").textContent = formatUSD(t.recoverableHardPod, 0);

    var counts = { ALL: report.ledger.length, CRIT: 0, REC: 0, WEAK: 0, SCR: 0, OTHER: 0 };
    report.ledger.forEach(function (item) {
      if (item.classification === "CRITICAL_RESCUE_HARD_POD") {
        counts.CRIT++;
        counts.REC++;
      } else if (item.classification === "RECOVERABLE_HARD_POD" || item.classification === "M-03_REDISPUTE_SOI_RISK") {
        counts.REC++;
      } else if (item.classification === "WEAK_EVIDENCE_EXCLUDED") {
        counts.WEAK++;
      } else if (item.classification === "SCR_REVERSED_CLOSED") {
        counts.SCR++;
      } else {
        counts.OTHER++;
      }
    });
    $("cnt-all").textContent = counts.ALL;
    $("cnt-crit").textContent = counts.CRIT;
    $("cnt-rec").textContent = counts.REC;
    $("cnt-weak").textContent = counts.WEAK;
    $("cnt-scr").textContent = counts.SCR;
    $("cnt-other").textContent = counts.OTHER;

    $("download-cfo-pdf-btn").disabled = false;

    $("res-recoverable").value = formatUSD(t.recoverableHardPod, 0);
    $("res-expiring").value = formatUSD(t.criticalRescueHardPod, 0);
    updateReservationBrief();

    renderTable();
  }

  function badgeForClassification(cls) {
    if (cls === "CRITICAL_RESCUE_HARD_POD") return '<span class="status-chip chip-critical">&lt;90d CRITICAL RESCUE</span>';
    if (cls === "RECOVERABLE_HARD_POD") return '<span class="status-chip chip-recoverable">RECOVERABLE HARD-POD</span>';
    if (cls === "M-03_REDISPUTE_SOI_RISK") return '<span class="status-chip chip-weak">M-03 RE-DISPUTE / SOI</span>';
    if (cls === "WEAK_EVIDENCE_EXCLUDED") return '<span class="status-chip chip-weak">WEAK / STRIPPED</span>';
    if (cls === "SCR_REVERSED_CLOSED") return '<span class="status-chip chip-scr">-SCR REVERSED</span>';
    if (cls === "INITIAL_LOCKOUT_WAIT") return '<span class="status-chip chip-muted">0-40d LOCKOUT</span>';
    return '<span class="status-chip chip-muted">EXPIRED (&gt;730d)</span>';
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderTable() {
    if (!state.lastReport) return;
    var filter = state.activeFilter;
    var rows = state.lastReport.ledger.filter(function (item) {
      if (filter === "ALL") return true;
      if (filter === "CRITICAL_RESCUE") return item.classification === "CRITICAL_RESCUE_HARD_POD";
      if (filter === "RECOVERABLE_HARD_POD") {
        return (
          item.classification === "RECOVERABLE_HARD_POD" ||
          item.classification === "CRITICAL_RESCUE_HARD_POD" ||
          item.classification === "M-03_REDISPUTE_SOI_RISK"
        );
      }
      if (filter === "WEAK_EVIDENCE_EXCLUDED") return item.classification === "WEAK_EVIDENCE_EXCLUDED";
      if (filter === "SCR_REVERSED") return item.classification === "SCR_REVERSED_CLOSED";
      return (
        item.classification === "INITIAL_LOCKOUT_WAIT" ||
        item.classification === "EXPIRED_PAST_730D" ||
        item.classification === "M-03_REDISPUTE_SOI_RISK"
      );
    });

    var tbody = $("audit-table-body");
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">No rows match the selected filter.</td></tr>';
      return;
    }

    tbody.innerHTML = rows
      .map(function (r) {
        var ageStr =
          r.daysElapsed === null
            ? "-"
            : r.daysElapsed + "d elapsed / " + (r.daysRemaining >= 0 ? r.daysRemaining + "d left" : "EXPIRED");
        var evStr =
          r.podStatus === "AUTO_CREDIT"
            ? "Auto-Credit"
            : escapeHTML(r.podStatus) + " · " + escapeHTML(r.asnNumber);
        return (
          "<tr>" +
          "<td><code>" + escapeHTML(r.invoiceNumber) + "</code></td>" +
          "<td><code>" + escapeHTML(r.poNumber) + "</code></td>" +
          "<td>" + escapeHTML(r.invoiceDate) + "</td>" +
          "<td>" + escapeHTML(ageStr) + "</td>" +
          '<td class="num">' + formatUSD(r.amount, 2) + "</td>" +
          "<td>" + evStr + "</td>" +
          "<td>" + badgeForClassification(r.classification) + "</td>" +
          "<td>" + escapeHTML(r.reason) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function toCsvString(headers, rows) {
    var lines = [headers.join(",")];
    rows.forEach(function (obj) {
      var line = headers
        .map(function (h) {
          var v = obj[h] !== undefined && obj[h] !== null ? String(obj[h]) : "";
          if (v.indexOf(",") !== -1 || v.indexOf('"') !== -1 || v.indexOf("\n") !== -1) {
            return '"' + v.replace(/"/g, '""') + '"';
          }
          return v;
        })
        .join(",");
      lines.push(line);
    });
    return lines.join("\r\n");
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  }

  function downloadSampleCSVs() {
    var remHeaders = ["Invoice Number", "PO Number", "Invoice Date", "Amount", "Invoice Type", "FC Code", "Prior Dispute Status"];
    var podHeaders = [
      "PO Number",
      "BOL Number",
      "Carrier",
      "ASN Number",
      "Delivery Date",
      "POD Status",
      "Signed POD Filename",
      "Units Shipped",
      "Units Invoiced"
    ];
    var remCsv = toCsvString(remHeaders, DEFAULT_DEMO_DATA.remittance);
    var podCsv = toCsvString(podHeaders, DEFAULT_DEMO_DATA.podIndex);

    triggerDownload(new Blob([remCsv], { type: "text/csv;charset=utf-8;" }), "remittance_shortages_redacted.csv");
    setTimeout(function () {
      triggerDownload(new Blob([podCsv], { type: "text/csv;charset=utf-8;" }), "3pl_bol_pod_index_redacted.csv");
    }, 250);
  }

  function pdfEscape(str) {
    return String(str || "")
      .replace(/[^\x20-\x7E]/g, "-")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function buildCfoMemoPdfBlob(report) {
    var t = report.totals;
    var r = report.roi;
    var cmds = [];

    function text(font, size, x, y, str, rgb) {
      var color = rgb || [0.06, 0.09, 0.16];
      cmds.push("BT");
      cmds.push("/" + font + " " + size + " Tf");
      cmds.push(color[0].toFixed(2) + " " + color[1].toFixed(2) + " " + color[2].toFixed(2) + " rg");
      cmds.push("1 0 0 1 " + x + " " + y + " Tm");
      cmds.push("(" + pdfEscape(str) + ") Tj");
      cmds.push("ET");
    }

    function rect(x, y, w, h, fillRgb, strokeRgb) {
      if (fillRgb) {
        cmds.push(fillRgb[0].toFixed(2) + " " + fillRgb[1].toFixed(2) + " " + fillRgb[2].toFixed(2) + " rg");
      }
      if (strokeRgb) {
        cmds.push(strokeRgb[0].toFixed(2) + " " + strokeRgb[1].toFixed(2) + " " + strokeRgb[2].toFixed(2) + " RG");
        cmds.push("1 w");
      }
      cmds.push(x + " " + y + " " + w + " " + h + " re " + (fillRgb && strokeRgb ? "B" : fillRgb ? "f" : "S"));
    }

    rect(36, 720, 540, 44, [0.06, 0.09, 0.16], null);
    text("F2", 12.5, 48, 745, "CFO PQV LOSS COUNTDOWN MEMO (15-SECOND ZERO-PASSWORD PRE-AUDIT)", [1, 1, 1]);
    var shortLabel = String(report.datasetLabel || "").slice(0, 52);
    text("F1", 8.5, 48, 730, "Generated locally in browser memory  |  " + shortLabel + "  |  Audit Date: " + report.auditDate, [0.8, 0.85, 0.92]);

    rect(36, 650, 540, 58, [0.99, 0.94, 0.94], [0.75, 0.11, 0.11]);
    text("F2", 10.5, 46, 692, "CRITICAL LEGAL WARNING: STATEMENT OF OPEN ITEMS (SOI) PERMANENT WAIVER", [0.60, 0.08, 0.08]);
    text("F2", 9.5, 46, 677, "Accepting an Amazon Vendor Central Statement of Open Items (SOI) bulk settlement", [0.45, 0.06, 0.06]);
    text("F2", 9.5, 46, 663, "permanently waives your right to dispute or recover all other open items in that time period.", [0.45, 0.06, 0.06]);

    text("F2", 11.5, 36, 628, "1. PRE-AUDIT RECONCILIATION SUMMARY", [0.06, 0.09, 0.16]);
    rect(36, 482, 540, 138, [0.97, 0.98, 0.99], [0.80, 0.84, 0.89]);

    var rows = [
      ["Gross PQV Shortages (" + t.grossCount + " rows)", formatUSD(t.gross, 2), false],
      ["Less: Amazon -SCR Auto-Reversal Credits (" + t.scrCount + " rows)", "-" + formatUSD(t.scrReversed, 2), false],
      ["Net Open PQV Balance", formatUSD(t.netOpen, 2), true],
      ["Verified Recoverable Hard-POD (M-01 + M-03)", formatUSD(t.recoverableHardPod, 2) + " (" + t.recoverableCount + " POs)", true],
      ["  - Urgent Hard-POD Rescue (<90d Before 730d Cutoff)", formatUSD(t.criticalRescueHardPod, 2) + " (" + t.criticalHardPodCount + " POs)", false],
      ["Stripped Before Charging: Weak / No-POD / Missing ASN", formatUSD(t.weakExcluded, 2) + " (" + t.weakCount + " POs)", false],
      ["Initial Lockout (0-40d) + Expired (>730d)", formatUSD(t.initialLockout + t.expired, 2), false]
    ];

    var ry = 602;
    rows.forEach(function (row) {
      text(row[2] ? "F2" : "F1", 10, 48, ry, row[0], [0.10, 0.14, 0.22]);
      text(row[2] ? "F2" : "F1", 10, 420, ry, row[1], row[0].indexOf("Urgent") !== -1 ? [0.72, 0.11, 0.11] : [0.06, 0.09, 0.16]);
      ry -= 18;
    });

    text("F2", 11.5, 36, 458, "2. $1,195 FLAT-FEE ROI VS. 25% CONTINGENCY & ENTERPRISE SAAS", [0.06, 0.09, 0.16]);
    rect(36, 366, 540, 84, [0.94, 0.99, 0.96], [0.65, 0.88, 0.76]);
    text("F2", 10, 48, 432, "PQV Pre-Audit Desk (0% Contingency Flat Fee):", [0.02, 0.37, 0.27]);
    text("F2", 10, 420, 432, "$1,195.00 flat", [0.02, 0.37, 0.27]);
    text("F1", 10, 48, 414, "ChargeGuard Equivalent (25% up to $250K, 15% above):", [0.15, 0.20, 0.28]);
    text("F1", 10, 420, 414, formatUSD(r.chargeguardFee, 2), [0.72, 0.11, 0.11]);
    text("F1", 10, 48, 396, "Reason Automation BASIS (Enterprise SaaS Subscription):", [0.15, 0.20, 0.28]);
    text("F1", 10, 420, 396, "$14,988.00 / yr ($1,249/mo)", [0.15, 0.20, 0.28]);
    text("F2", 10.5, 48, 376, "Net Fee Savings vs. 25% Agency on This Batch:", [0.02, 0.37, 0.27]);
    text("F2", 10.5, 420, 376, formatUSD(r.savingsVsAgency, 2) + " (" + r.netYieldPct.toFixed(1) + "% kept)", [0.02, 0.37, 0.27]);

    text("F2", 11.5, 36, 342, "3. TOP HARD-POD ITEMS REQUIRING IMMEDIATE ACTION (<90d RESCUE FIRST)", [0.06, 0.09, 0.16]);
    rect(36, 174, 540, 160, [1, 1, 1], [0.80, 0.84, 0.89]);
    text("F2", 9, 46, 318, "PO Number        Invoice          Days Left     Amount           Evidence", [0.25, 0.30, 0.38]);

    var priorityItems = report.ledger
      .filter(function (x) {
        return (
          x.classification === "CRITICAL_RESCUE_HARD_POD" ||
          x.classification === "RECOVERABLE_HARD_POD" ||
          x.classification === "M-03_REDISPUTE_SOI_RISK"
        );
      })
      .sort(function (a, b) {
        return (a.daysRemaining || 999) - (b.daysRemaining || 999);
      })
      .slice(0, 7);

    var py = 300;
    if (priorityItems.length === 0) {
      text("F1", 9.5, 46, py, "No verified Hard-POD items found in this dataset.", [0.35, 0.40, 0.48]);
    } else {
      priorityItems.forEach(function (item) {
        var line =
          (item.poNumber + "              ").slice(0, 14) +
          " " +
          (item.invoiceNumber + "              ").slice(0, 14) +
          " " +
          (item.daysRemaining + "d left       ").slice(0, 12) +
          " " +
          (formatUSD(item.amount, 2) + "             ").slice(0, 14) +
          " " +
          item.podStatus +
          " / " +
          item.asnNumber;
        text("F1", 9, 46, py, line, item.classification === "CRITICAL_RESCUE_HARD_POD" ? [0.72, 0.11, 0.11] : [0.10, 0.14, 0.22]);
        py -= 17;
      });
    }

    rect(36, 56, 540, 102, [0.95, 0.96, 0.98], [0.80, 0.84, 0.89]);
    text("F2", 10, 48, 140, "ZERO-PASSWORD, ZERO-SP-API, SELF-UPLOAD COMPLIANCE PLEDGE", [0.06, 0.09, 0.16]);
    text("F1", 9, 48, 124, "- Zero Vendor Central passwords, zero user portal invites, and zero SP-API keys ever requested.", [0.20, 0.25, 0.33]);
    text("F1", 9, 48, 110, "- We never file disputes or negotiate on your behalf. Your team self-uploads <=10MB PDFs in ~35 minutes.", [0.20, 0.25, 0.33]);
    text("F1", 9, 48, 96, "- PQV Pre-Audit Desk is an independent Amazon 1P deduction documentation tool (not a law/collection firm).", [0.20, 0.25, 0.33]);
    var contactNote = state.reservationEmail
      ? "Reserve $1,195 pack build slot: email " + state.reservationEmail + " with this summary."
      : "Reserve $1,195 pack build slot: reply directly to our outreach email with this 1-page summary.";
    text("F2", 9, 48, 74, contactNote, [0.11, 0.31, 0.85]);

    var streamContent = cmds.join("\n");
    var enc = new TextEncoder();
    var streamBytes = enc.encode(streamContent);

    var objects = [];
    objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    objects.push(
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n"
    );
    objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");
    objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");
    objects.push(
      "6 0 obj\n<< /Length " + streamBytes.length + " >>\nstream\n" + streamContent + "\nendstream\nendobj\n"
    );

    var header = "%PDF-1.4\n";
    var offsets = [0];
    var bodyParts = [header];
    var cursor = enc.encode(header).length;

    objects.forEach(function (objStr) {
      offsets.push(cursor);
      bodyParts.push(objStr);
      cursor += enc.encode(objStr).length;
    });

    var xrefPos = cursor;
    var xrefLines = ["xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n"];
    for (var i = 1; i < offsets.length; i++) {
      var off = String(offsets[i]).padStart(10, "0");
      xrefLines.push(off + " 00000 n \n");
    }
    var trailer =
      "trailer\n<< /Size " +
      (objects.length + 1) +
      " /Root 1 0 R >>\nstartxref\n" +
      xrefPos +
      "\n%%EOF\n";

    var fullPdf = bodyParts.join("") + xrefLines.join("") + trailer;
    return new Blob([enc.encode(fullPdf)], { type: "application/pdf" });
  }

  function buildReservationPayload() {
    var t = state.lastReport ? state.lastReport.totals : null;
    return {
      offer: "PQV Pre-Audit Pack Slot ($1,195 Flat Fee, 0% Contingency)",
      reply_to_email: state.reservationEmail || null,
      brand_name: $("res-brand").value.trim() || "",
      finance_email: $("res-email").value.trim() || "",
      monthly_1p_po_volume: $("res-volume").value.trim() || "",
      computed_recoverable_hard_pod: $("res-recoverable").value.trim() || "$0",
      computed_expiring_under_90d: $("res-expiring").value.trim() || "$0",
      audit_snapshot: t
        ? {
            audit_date: state.lastReport.auditDate,
            gross_pqv_usd: t.gross,
            scr_reversed_usd: t.scrReversed,
            net_open_usd: t.netOpen,
            recoverable_hard_pod_usd: t.recoverableHardPod,
            critical_rescue_hard_pod_usd: t.criticalRescueHardPod,
            weak_evidence_excluded_usd: t.weakExcluded
          }
        : null,
      notes: $("res-notes").value.trim() || "",
      compliance_pledge: [
        "Zero Vendor Central password or SP-API credentials shared",
        "Client self-uploads <=10MB dispute PDFs (~35 min)",
        CONFIG.SOI_WARNING_TEXT
      ]
    };
  }

  function buildReservationBriefText() {
    var p = buildReservationPayload();
    var lines = [
      "PQV Pre-Audit Slot Reservation ($1,195 Flat Fee / 0% Contingency)",
      "----------------------------------------------------------------",
      "Reply-To: " + (p.reply_to_email || "(Reply directly to our outreach email)"),
      "Brand: " + (p.brand_name || "[Brand Name]"),
      "Finance Contact: " + (p.finance_email || "[Finance Email]"),
      "Monthly 1P PO Volume: " + (p.monthly_1p_po_volume || "Not specified"),
      "Computed Hard-POD Recoverable: " + p.computed_recoverable_hard_pod,
      "Computed Expiring <90d Hard-POD Rescue: " + p.computed_expiring_under_90d,
      "Notes: " + (p.notes || "None"),
      "",
      "Compliance Confirmation:",
      "- Zero Vendor Central password / zero SP-API credentials shared",
      "- Client self-uploads <=10MB dispute PDFs (~35 min)",
      "- SOI Reminder: " + CONFIG.SOI_WARNING_TEXT
    ];
    return lines.join("\n");
  }

  function updateReservationBrief() {
    var brief = buildReservationBriefText();
    $("brief-preview").textContent = brief;
    var mailtoBtn = $("mailto-reserve-btn");
    if (state.reservationEmail) {
      $("desk-inbox-display").innerHTML = "<code>" + escapeHTML(state.reservationEmail) + "</code>";
      var brand = $("res-brand").value.trim() || "Amazon 1P Brand";
      var subject =
        "PQV Pack Slot Reservation - " +
        brand +
        " (" +
        ($("res-recoverable").value.trim() || "$0") +
        " Hard-POD)";
      mailtoBtn.href =
        "mailto:" +
        encodeURIComponent(state.reservationEmail) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(brief);
      mailtoBtn.hidden = false;
    } else {
      $("desk-inbox-display").textContent =
        "Isolated custom reply-to domain finalizing — copy or download your pre-audit summary below, or reply directly to our outreach email.";
      mailtoBtn.hidden = true;
      mailtoBtn.href = "#";
    }
  }

  function readFileAsText(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
      cb(null, e.target.result);
    };
    reader.onerror = function () {
      cb(new Error("Could not read file: " + file.name));
    };
    reader.readAsText(file);
  }

  function showError(msg) {
    var el = $("engine-error");
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
    } else {
      el.hidden = false;
      el.textContent = msg;
    }
  }

  function runInstantDemo() {
    showError("");
    $("audit-date-input").value = DEFAULT_DEMO_DATA.auditDate;
    var report = runPreAuditEngine(
      DEFAULT_DEMO_DATA.remittance,
      DEFAULT_DEMO_DATA.podIndex,
      DEFAULT_DEMO_DATA.auditDate,
      DEFAULT_DEMO_DATA.datasetName
    );
    renderReport(report);
    var engineEl = $("engine");
    if (engineEl && typeof engineEl.scrollIntoView === "function") {
      engineEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function runUploadedCsvAudit() {
    showError("");
    if (!state.uploadedRemittanceText || !state.uploadedPodText) {
      showError("Please load both the Vendor Central Remittance CSV and the 3PL BOL/POD Index CSV.");
      return;
    }
    try {
      var remRecords = parseCSV(state.uploadedRemittanceText);
      var podRecords = parseCSV(state.uploadedPodText);
      var dateVal = $("audit-date-input").value || new Date().toISOString().slice(0, 10);
      var report = runPreAuditEngine(remRecords, podRecords, dateVal, "Local Browser CSV Upload");
      renderReport(report);
    } catch (err) {
      showError(err && err.message ? err.message : "Failed to parse CSV files.");
    }
  }

  function wireFileZone(inputId, zoneId, statusId, stateKey) {
    var input = $(inputId);
    var zone = $(zoneId);
    var status = $(statusId);

    function handleFile(file) {
      if (!file) return;
      readFileAsText(file, function (err, text) {
        if (err) {
          showError(err.message);
          return;
        }
        state[stateKey] = text;
        zone.classList.add("loaded");
        status.textContent =
          "Loaded locally: " + file.name + " (" + Math.max(1, Math.round(file.size / 1024)) + " KB)";
        $("run-uploaded-btn").disabled = !(state.uploadedRemittanceText && state.uploadedPodText);
      });
    }

    input.addEventListener("change", function (e) {
      handleFile(e.target.files[0]);
    });

    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", function () {
      zone.classList.remove("dragover");
    });

    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      zone.classList.remove("dragover");
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  function init() {
    $("audit-date-input").value = DEFAULT_DEMO_DATA.auditDate;

    $("hero-demo-btn").addEventListener("click", runInstantDemo);
    $("run-demo-btn").addEventListener("click", runInstantDemo);
    $("run-uploaded-btn").addEventListener("click", runUploadedCsvAudit);
    $("download-sample-csvs-btn").addEventListener("click", downloadSampleCSVs);

    $("download-cfo-pdf-btn").addEventListener("click", function () {
      if (!state.lastReport) return;
      var blob = buildCfoMemoPdfBlob(state.lastReport);
      triggerDownload(blob, "CFO_PQV_Loss_Countdown_Memo.pdf");
    });

    $("download-brief-json-btn").addEventListener("click", function () {
      var payload = buildReservationPayload();
      triggerDownload(
        new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8;" }),
        "pqv_preaudit_reservation_brief.json"
      );
    });

    wireFileZone("remittance-file", "remittance-dropzone", "remittance-status", "uploadedRemittanceText");
    wireFileZone("pod-file", "pod-dropzone", "pod-status", "uploadedPodText");

    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".tab-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        state.activeFilter = btn.getAttribute("data-filter");
        renderTable();
      });
    });

    ["res-brand", "res-email", "res-volume", "res-recoverable", "res-expiring", "res-notes"].forEach(function (id) {
      $(id).addEventListener("input", updateReservationBrief);
    });

    $("copy-brief-btn").addEventListener("click", function () {
      var brief = buildReservationBriefText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(brief).then(function () {
          $("copy-feedback").hidden = false;
        });
      } else {
        $("copy-feedback").hidden = false;
      }
    });

    var initialReport = runPreAuditEngine(
      DEFAULT_DEMO_DATA.remittance,
      DEFAULT_DEMO_DATA.podIndex,
      DEFAULT_DEMO_DATA.auditDate,
      DEFAULT_DEMO_DATA.datasetName
    );
    renderReport(initialReport);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
