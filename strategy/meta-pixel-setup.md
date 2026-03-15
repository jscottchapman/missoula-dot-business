# Meta Pixel Setup Guide

## Status: Code is deployed, needs Pixel ID

The Meta Pixel code and Lead conversion event are already in `index.html`. You just need to create the account and swap in your Pixel ID.

## Step 1: Create Meta Business Account (15 min)
1. Go to [business.facebook.com](https://business.facebook.com) → Create Account
2. Sign in with your personal Facebook account (won't be publicly linked)
3. Enter: business name, your name, business email

## Step 2: Get Your Pixel ID (5 min)
1. In Meta Business Suite → **All Tools → Events Manager**
2. Click **Connect Data Sources → Web → Meta Pixel**
3. Name: "Missoula Business Pixel"
4. Enter website: missoula.business
5. Copy the **15-16 digit Pixel ID**

## Step 3: Add Pixel ID to Site (5 min)
1. Open `index.html`
2. Find `META_PIXEL_ID` (appears in 2 places in the `<head>`)
3. Replace both with your actual Pixel ID
4. Commit and push to deploy

## Step 4: Verify Domain (15 min)
1. In Meta Business Suite → **Business Settings → Brand Safety → Domains**
2. Add missoula.business
3. Add the DNS TXT record to your domain (via your DNS provider)
4. Click Verify

## Step 5: Configure Event Priority (5 min)
1. In Events Manager → **Aggregated Event Measurement**
2. Add missoula.business
3. Set "Lead" as **Event #1** (highest priority)

## What's Already Wired
- `fbq('track', 'PageView')` — fires on every page load
- `fbq('track', 'Lead')` — fires on successful audit form submission
- Works alongside GA4 `audit_submit` event

## Future: Conversions API (Week 2)
Add server-side tracking in `/api/audit.js` for better iOS attribution:
```javascript
// After successful audit, call Meta CAPI
await fetch(`https://graph.facebook.com/v21.0/YOUR_PIXEL_ID/events`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        em: [sha256(email)],
        client_ip_address: ip,
        client_user_agent: req.headers['user-agent']
      }
    }],
    access_token: process.env.META_CAPI_TOKEN
  })
});
```

## iOS Privacy Notes
- ~75-80% of iOS users opt out of tracking (ATT)
- Your reported conversions will undercount by 20-40% — this is normal
- Advanced Matching (passing email to fbq) recovers ~20-30% of lost signals
- CAPI recovers most of the rest
- At $15-30/day spend, focus on directional trends, not exact ROAS
