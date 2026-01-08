/*************************
 ₹10Invest – Frontend app.js
 Connected to Backend API
**************************/

const API_BASE = "http://localhost:3000";

/* ================= INVEST ================= */

/* CUMULATIVE QUICK BUTTONS */
function setAmount(val) {
    const input = document.getElementById("amount");
    if (!input) return;

    const current = parseInt(input.value) || 0;
    input.value = current + val;
}

/* INVEST USING BACKEND */
function investCustom() {
    const input = document.getElementById("amount");
    if (!input) return;

    const amount = parseInt(input.value);

    if (isNaN(amount) || amount < 10) {
        updateStatus("Minimum investment amount is ₹10", true);
        return;
    }

    fetch(`${API_BASE}/invest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        })
        .then(res => res.json())
        .then(data => {
            updateStatus(data.message);
            input.value = "";
            showSummary();
            showHistory();
        })
        .catch(() => {
            updateStatus("Server not reachable. Please try again.", true);
        });
}

/* ================= HISTORY ================= */

function showHistory() {
    const table = document.getElementById("historyTable");
    if (!table) return;

    fetch(`${API_BASE}/investments`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                table.innerHTML =
                    `<tr><td colspan="3">No investments yet</td></tr>`;
                return;
            }

            table.innerHTML = "";

            data.forEach(inv => {
                const risk = inv.risk || "Low"; // fallback safety
                let riskColor = "#15803d";

                if (risk === "Medium") riskColor = "#ca8a04";
                if (risk === "High") riskColor = "#b91c1c";

                table.innerHTML += `
                    <tr>
                        <td>₹${inv.amount}</td>
                        <td>${inv.date}</td>
                        <td style="font-weight:600;color:${riskColor}">
                            ${risk}
                        </td>
                    </tr>`;
            });
        })
        .catch(() => {
            table.innerHTML =
                `<tr><td colspan="3">Unable to load history</td></tr>`;
        });
}

/* ================= SUMMARY ================= */

function showSummary() {
    const totalBox = document.getElementById("totalInvestment");
    const growthBox = document.getElementById("growthValue");
    if (!totalBox || !growthBox) return;

    fetch(`${API_BASE}/summary`)
        .then(res => res.json())
        .then(data => {
            totalBox.innerText = "Total Invested: ₹" + data.totalInvested;
            growthBox.innerText =
                "Estimated Value (Safe): ₹" + data.estimatedValue;
        });
}

/* ================= STATUS ================= */

function updateStatus(message, isError = false) {
    const status = document.getElementById("status");
    if (!status) return;

    status.innerText = message;
    status.style.color = isError ? "#b91c1c" : "#15803d";
}

/* ================= SIMPLE MODE ================= */

function toggleSimpleMode() {
    document.body.style.background = "#ffffff";
    document.body.style.fontSize = "14px";
    alert("Simple Mode Enabled\nOptimized for low-end phones");
}

/* ================= INIT ================= */

window.onload = function() {
    showHistory();
    showSummary();
};
