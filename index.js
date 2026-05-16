const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const SF_INSTANCE = process.env.SF_INSTANCE_URL || "https://orgfarm-cdbac71938-dev-ed.develop.my.salesforce.com";
const ACCESS_TOKEN = process.env.SF_ACCESS_TOKEN;

app.get("/api/validation-rules", async (req, res) => {
  const query = `SELECT Id, ValidationName, Active, Description FROM ValidationRule WHERE EntityDefinition.QualifiedApiName = 'Account'`;
  const url = `${SF_INSTANCE}/services/data/v59.0/tooling/query?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  const data = await response.json();
  res.json(data);
});

app.patch("/api/validation-rules/:id", async (req, res) => {
  const url = `${SF_INSTANCE}/services/data/v59.0/tooling/sobjects/ValidationRule/${req.params.id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  res.status(response.status).json({ ok: response.ok });
});

app.get("/api/validation-rules/:id", async (req, res) => {
  const url = `${SF_INSTANCE}/services/data/v59.0/tooling/sobjects/ValidationRule/${req.params.id}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));