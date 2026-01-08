/*************************
 ₹10Invest – Backend Server (Node 22 SAFE)
 Works with VS Code Live Server
**************************/

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

/* ================= MIDDLEWARE ================= */

// CORS for Live Server (NO wildcard route)
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

app.use(express.json());

/* ================= DATA INIT ================= */

function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify({ users: [], investments: [] }, null, 2)
        );
    }
}

function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch {
        return { users: [], investments: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

initDataFile();

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
    res.json({ status: "₹10Invest Backend Running ✅" });
});

/* Demo Login */
app.post("/login", (req, res) => {
    const mobile = String(req.body.mobile || "").trim();
    if (!mobile) {
        return res.status(400).json({ message: "Mobile number required" });
    }

    const data = readData();
    if (!data.users.includes(mobile)) {
        data.users.push(mobile);
        writeData(data);
    }

    res.json({ message: "OTP verified (demo)", user: mobile });
});

function getRiskLevel(amount) {
    if (amount < 100) return "Low";
    if (amount < 500) return "Medium";
    return "High";
}

/* Invest */
app.post("/invest", (req, res) => {
    console.log("📥 Invest request:", req.body);

    const amount = Number(req.body.amount);

    if (isNaN(amount) || amount < 10) {
        return res.status(400).json({
            message: "Minimum investment amount is ₹10",
        });
    }

    const data = readData();

    const investment = {
        amount,
        date: new Date().toLocaleDateString("en-IN"),
        risk: getRiskLevel(amount),
    };

    data.investments.push(investment);
    writeData(data);

    res.json({
        message: `₹${amount} invested successfully`,
        investment,
    });
});

/* History */
app.get("/investments", (req, res) => {
    const data = readData();
    res.json(data.investments);
});

/* Summary */
app.get("/summary", (req, res) => {
    const data = readData();
    const total = data.investments.reduce((s, i) => s + i.amount, 0);

    res.json({
        totalInvested: total,
        estimatedValue: Math.round(total * 1.06),
    });
});

/* ================= START ================= */

app.listen(PORT, () => {
    console.log(`🚀 ₹10Invest backend running at http://localhost:${PORT}`);
});
