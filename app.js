
const $ = id => document.getElementById(id);

const state = {
  amount: 50000,
  name: "",
  phone: "",
  country: "Tanzania",
  purpose: "",
  reference: ""
};

const money = n =>
  Number(n).toLocaleString("en-US") + " TZS";

// Update loan amount
$("loanAmount").addEventListener("input", e => {
  state.amount = Number(e.target.value);

  $("amountText").textContent = money(state.amount);
});

// Move to applicant details
$("toDetails").onclick = () => {
  alert("Tafadhali endelea kujaza taarifa zako.");

  window.location.href = "applicant-details.html";
};

// Save applicant details
function saveApplicantDetails() {
  state.name = $("name").value.trim();
  state.phone = $("phone").value.trim();
  state.country = $("country").value.trim();
  state.purpose = $("purpose").value.trim();

  localStorage.setItem(
    "loanApplication",
    JSON.stringify(state)
  );
}

// Escape unsafe text
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// Generate demo application reference
function generateReference() {
  return "DEMO-" +
    Math.random().toString(36).slice(2, 9).toUpperCase();
}

// Load saved application
function getApplication() {
  return JSON.parse(
    localStorage.getItem("loanApplication") || "{}"
  );
}

// Save application
function saveApplication(data) {
  localStorage.setItem(
    "loanApplication",
    JSON.stringify(data)
  );
}

// Show application summary
function displaySummary() {
  const data = getApplication();
  const summary = $("reviewDetails");

  if (!summary) return;

  const rows = [
    ["Kiasi cha mkopo", money(data.amount)],
    ["Jina kamili", data.name],
    ["Simu", data.phone],
    ["Nchi", data.country],
    ["Sababu", data.purpose]
  ];

  summary.innerHTML = rows.map(([key, value]) =>
    `<dt>${escapeHTML(key)}</dt>
     <dd>${escapeHTML(value || "")}</dd>`
  ).join("");
}

// Submit application
function submitApplication() {
  const data = getApplication();

  data.reference = generateReference();
  data.status = "Inasubiri ukaguzi";

  saveApplication(data);

  window.location.href = "confirmation.html";
}

// Display confirmation
function displayConfirmation() {
  const data = getApplication();

  if ($("reference")) {
    $("reference").textContent =
      data.reference || "Haijapatikana";
  }

  if ($("decision")) {
    $("decision").textContent =
      "Hali: " + (data.status || "Inasubiri ukaguzi");
  }
}

// Restart application
function restartApplication() {
  localStorage.removeItem("loanApplication");
  window.location.href = "index.html";
}

// Connect page buttons safely
if ($("applicantForm")) {
  $("applicantForm").addEventListener("submit", e => {
    e.preventDefault();
    saveApplicantDetails();
    window.location.href = "review.html";
  });
}

if ($("reviewDetails")) {
  displaySummary();
}

if ($("sendApplication")) {
  $("sendApplication").onclick = submitApplication;
}

if ($("reference")) {
  displayConfirmation();
}

if ($("restart")) {
  $("restart").onclick = restartApplication;
        }
