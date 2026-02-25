// backend engine
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-email', async (req, res) => {
  const { name, company } = req.body;
  
  try {
    // 1. Get real domain from Company Name
    const apiRes = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(company)}`);
    const results = await apiRes.json();
    const domain = results[0]?.domain || `${company.toLowerCase().replace(/\s/g, '')}.com`;

    // 2. Generate Email
    const parts = name.toLowerCase().split(' ');
    const first = parts[0];
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    const email = last ? `${first}.${last}@${domain}` : `${first}@${domain}`;

    res.json({ email });
  } catch (e) {
    res.status(500).json({ error: "API Down" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
