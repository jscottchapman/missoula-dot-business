# Instagram & Facebook Ad Plan — missoula.business

## Objective
Generate leads (SEO audit submissions + phone calls) from Missoula-area business owners.

---

## Audience Targeting

### Primary Audience
- **Location:** Missoula, MT + 25 mile radius (covers Lolo, Frenchtown, Bonner, East Missoula, Florence)
- **Age:** 28-60
- **Interests:** Small business, entrepreneurship, business owner, marketing, local business
- **Job titles:** Owner, Founder, Manager, CEO, General Manager (use detailed targeting)
- **Exclude:** People who work at agencies, marketing companies, or tech companies (they're not the buyer)

### Secondary Audience (Lookalike — build after 50+ audit leads)
- 1% lookalike of people who submitted the audit form
- Same geographic targeting

### Retargeting Audience (set up from day 1)
- Website visitors who didn't submit the form (Meta Pixel required)
- Video viewers (75%+ completion on video ads)

---

## Campaign Structure

### Campaign 1: "Pain Point Awareness" (Top of Funnel)
**Objective:** Traffic to missoula.business
**Daily budget:** $10-15/day
**Duration:** Always on

**Ad Set A — "Still doing it manually?"**
- Creative: `still-posting-manually.png`
- Caption: "Missoula business owners: you're spending 5+ hours a week on marketing that AI could handle in 30 minutes. What would you do with 260 extra hours this year? Free SEO audit at the link in bio."
- CTA button: Learn More → missoula.business

**Ad Set B — "You at 9pm vs. Competitor at 9pm"**
- Creative: `you-vs-competitor-9pm.png`
- Caption: "Which side are you on? AI can automate your social media, follow-ups, and reporting — so you can stop working at 9pm. See how your business stacks up: free audit at the link."
- CTA button: Learn More → missoula.business

**Ad Set C — "How many of these are eating your week?"**
- Creative: `eating-your-week-checklist.png`
- Caption: "If you checked more than 2, we should talk. These are the exact tasks we automate for Missoula businesses — starting at $500. Free SEO audit at missoula.business"
- CTA button: Learn More → missoula.business

### Campaign 2: "Value & Proof" (Middle of Funnel)
**Objective:** Conversions (audit form submissions)
**Daily budget:** $10/day
**Duration:** Always on
**Audience:** Retarget website visitors + video viewers

**Ad Set A — "46% stat"**
- Creative: `46-percent-local.png`
- Caption: "Nearly half of all Google searches are people looking for a local business right now. Are they finding yours? We'll tell you for free. Takes 30 seconds."
- CTA button: Sign Up → missoula.business#audit

**Ad Set B — "Marketing vs actual work"**
- Creative: `marketing-vs-actual-work.png`
- Caption: "A Missoula business owner told us she spent more time on marketing than actual work. We set up AI to handle her content, social posts, and email campaigns. Now she reviews everything in 30 minutes a week. What would you do with that time?"
- CTA button: Learn More → missoula.business

**Ad Set C — Testimonial**
- Creative: `testimonial-lowell.png`
- Caption: "2x engagement. 10 hours saved weekly. Built in 2 weeks. That's what happened when we automated engagement for an automotive training company. Your business is next. Free audit at missoula.business"
- CTA button: Learn More → missoula.business

### Campaign 3: "Industry-Specific" (Targeted)
**Objective:** Conversions
**Daily budget:** $5-10/day per industry
**Duration:** Rotate monthly

**Ad Set A — Restaurants** (target: restaurant owners, food service, hospitality)
- Creative: `restaurant-reviews.png`
- Caption: "Missoula restaurant owners: what if every Google review got a thoughtful response within hours — without you doing anything? We build AI that handles review responses, reservation follow-ups, and social media. Save 3+ hours/week. Free audit at missoula.business"

**Ad Set B — Contractors** (target: construction, plumbing, HVAC, electrician, handyman)
- Creative: `what-if-60-seconds.png`
- Caption: "Missoula contractors: every missed follow-up is a lost job. What if every lead got a response in under 60 seconds — even when you're on a job site? AI handles your inquiries, books estimates, and follows up automatically. missoula.business"

**Ad Set C — Professional Services** (target: lawyers, accountants, dentists, realtors)
- Creative: `what-if-60-seconds.png`
- Caption: "Missoula professionals: your clients expect fast responses. AI can qualify leads, schedule appointments, and send reminders — 24/7, no receptionist needed. Starting at $500. Free audit at missoula.business"

---

## Budget Summary

| Campaign | Daily Budget | Monthly Cost |
|----------|-------------|-------------|
| Pain Point Awareness | $12 | ~$360 |
| Value & Proof (retargeting) | $10 | ~$300 |
| Industry-Specific | $8 | ~$240 |
| **Total** | **$30/day** | **~$900/month** |

Start with $15-20/day (Campaigns 1 + 2) and add Campaign 3 after you have retargeting data.

---

## Setup Checklist

### Before Running Ads
- [ ] Install Meta Pixel on missoula.business (add to `<head>`)
- [ ] Set up conversion event for audit form submission
- [ ] Create Meta Business page for "Missoula.business"
- [ ] Link Instagram account to Meta Business
- [ ] Upload all 8 social card images to the ad account
- [ ] Set up custom audience: website visitors (180 days)
- [ ] Verify business location on Facebook/Instagram

### Meta Pixel Code (add to index.html `<head>`)
```html
<!-- Meta Pixel — replace PIXEL_ID with your actual pixel ID -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### Track Audit Form Submission
Add this to the form success handler in index.html:
```javascript
// After successful audit submission
if (typeof fbq === 'function') {
  fbq('track', 'Lead', { content_name: 'seo_audit', content_category: 'audit' });
}
```

---

## Content Calendar (Organic Posts)

Post 3x/week using the social cards + captions. Rotate through all 8 cards over ~3 weeks, then create new variants.

### Week 1
- **Mon:** `still-posting-manually.png` + caption about time savings
- **Wed:** `eating-your-week-checklist.png` + engagement question "How many did you check?"
- **Fri:** `testimonial-lowell.png` + story about the result

### Week 2
- **Mon:** `you-vs-competitor-9pm.png` + "Which side are you on?"
- **Wed:** `46-percent-local.png` + local search stat education
- **Fri:** `marketing-vs-actual-work.png` + relatable business owner story

### Week 3
- **Mon:** `what-if-60-seconds.png` + lead response speed stat
- **Wed:** `restaurant-reviews.png` + industry-specific value prop
- **Fri:** Behind-the-scenes / personal post (Scott's story, Missoula-specific, humanizing)

### Engagement Strategy
- Reply to every comment within 2 hours
- Follow local Missoula business accounts
- Comment genuinely on local business posts (not salesy)
- Share/repost local business content occasionally
- Use local hashtags: #Missoula #MissoulaMT #MissoulaBusiness #SupportLocalMissoula #MontanaBusiness #406Life

---

## Key Metrics to Track

| Metric | Target | Action if below |
|--------|--------|----------------|
| CPM (cost per 1K impressions) | < $15 | Broaden audience |
| CTR (click-through rate) | > 1.5% | Test new creatives |
| CPC (cost per click) | < $2 | Test new captions |
| Cost per audit submission | < $15 | Optimize landing page |
| Cost per phone call | < $25 | A/B test CTAs |
| Audit → call conversion | > 15% | Improve drip sequence |

---

## Scaling Plan

1. **Month 1 ($450-600):** Run Campaigns 1+2, build retargeting audiences, optimize creatives
2. **Month 2 ($600-900):** Add Campaign 3 (industry-specific), create lookalike audiences from audit leads
3. **Month 3 ($900+):** Scale winners, kill underperformers, create video ads (screen recordings of audit results, before/after demos)
4. **Ongoing:** New card designs monthly, seasonal Missoula-specific content, expand to Google Local Service Ads

## Google Voice Optimization

Your (406) 200-8107 Google Voice number:
- Add it to your Google Business Profile
- Make sure voicemail greeting mentions "missoula.business" and the free audit
- Set up text auto-reply: "Thanks for reaching out! I'm Scott from missoula.business. I'll get back to you within a few hours. In the meantime, you can get a free SEO audit at missoula.business"
- Enable call forwarding to your personal phone during business hours (8am-6pm MT)
