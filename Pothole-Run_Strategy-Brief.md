# Pothole Run — Strategy Brief

**Prepared for:** Milton Foster
**Date:** 7 July 2026
**Scope:** Distribution (app vs site), age rating, and monetization — decision-oriented. Not the game build.

---

## Bottom line up front

Ship it as a **free, installable PWA first.** Spend nothing on stores yet. Treat Pothole Run as a **marketing / brand asset for The Jamaican Polyglot**, not a revenue product — because a casual web game almost never moves an income needle, and yours needs moving fast. The realistic money here is **one tasteful local sponsor**, not thousands of micro-payments. Store apps, IAP, and paid ratings are a *later* decision you make only if it gets traction.

**Honest priority-fit flag:** Pothole Run isn't in your established priority sequence (live album → DaVinci guide → first TJP piece → media kit → Source Connect → Language Linkup). It's a new open loop. That's fine *if* it stays cheap and doubles as TJP content. It becomes a problem the moment you start building payment backends and store infrastructure before it has a single player — which is exactly your "infrastructure-before-execution" pattern. Keep it in the content lane until the audience is proven.

---

## 1. App vs Site

**Recommendation: PWA-first. Wrap for Google Play later only if it earns it. Skip iOS App Store for now.**

For a solo creator minimising spend, serving a mobile-heavy Jamaican audience on mixed devices and real data budgets, a web/PWA wins on every axis that matters to you right now.

| Factor | PWA (web) | Google Play (TWA/Capacitor) | iOS App Store (Capacitor) |
|---|---|---|---|
| **Reach** | Any phone with a browser, one link, instant | Android only, needs install | iPhone only, needs install |
| **Install friction** | "Add to Home Screen" — near zero | Store download (~15–60MB shell) | Store download |
| **Discoverability** | You must drive traffic (TJP does this well) | Play search + store listing | App Store search |
| **Cost** | **$0** (you already have hosting/domain) | **$25 one-time** dev fee | **$99/year** dev fee |
| **Offline play** | Yes — service worker caches assets after first load (**big deal for JM data costs**) | Yes | Yes |
| **Update friction** | Instant — you push, everyone gets it | Store review each update | Store review each update (slower) |
| **Monetization** | You control checkout (Lynk, PayPal, tips) | Store IAP (15–30% cut) or keep web checkout | Store IAP (15–30% cut) |
| **Maintenance** | One codebase | + build/sign/submit pipeline | + Mac build + yearly renewal + stricter review |

**Why PWA first, concretely:**

- **Offline is a real gift to your audience.** A cached PWA plays with the data connection off. For players on prepaid bundles, a game that doesn't re-download or stream ads every session is a genuine kindness *and* a selling point.
- **TJP already solves discoverability.** Your problem was never "how do people find my thing in a store" — it's converting your ~4,700-follower, award-winning brand into action. A link in bio beats a store listing you'd have to market from scratch.
- **Zero spend, instant iteration.** You fix a pothole-spawn bug and everyone has it in seconds — no review queue.

**Packaging paths, in order of effort:**

1. **Installable PWA** *(effort: low)* — add a web manifest + service worker to the existing HTML/JS/Canvas build. Host on `miltonfoster.com` or a subdomain (e.g. `play.miltonfoster.com`). Prompt "Add to Home Screen." This is the whole product for now.
2. **Google Play via TWA (Bubblewrap or PWABuilder)** *(effort: low–medium)* — wraps the same PWA in a thin Android shell, no rewrite. Costs the one-time **$25**. Do this only when you want Play's discoverability or a sponsor wants an "on the Play Store" bullet point. *Caveat: new personal Play accounts must run a closed test with ~12 testers for ~14 days before you can go to production — build that time in.*
3. **iOS via Capacitor + Apple Developer Program** *(effort: medium–high)* — wraps it for the App Store but costs **$99/year**, needs a Mac build, and Apple's **Guideline 4.2 ("minimum functionality")** routinely rejects thin website-wrappers, so you'd likely have to add native polish to pass. **Defer this** until there's proven demand *and* you've confirmed Apple can even pay a Jamaica-based developer (see §3 — this is unconfirmed).

*Verified: Google Play $25 one-time; Apple $99/year. Sources at end.*

---

## 2. Age Rating

**Note first:** on the **web/PWA there is no mandatory rating** — no store gatekeeper. Rating only becomes a requirement the day you list on Google Play or the App Store, where you fill one **IARC** questionnaire that generates ESRB / PEGI / etc. ratings automatically. So this is a store-time concern, not a launch blocker.

**Your content, rated honestly:**

- Cartoon driving, potholes, burnt-out cars → harmless. Environmental, no rating impact.
- Crocodiles that bite → **cartoon/fantasy violence.** Fine at the lowest tiers *if it stays bloodless and comedic* (a chomp/bump, not gore or on-screen death).
- River Mumma (folklore water spirit) → fine. Mythology, not horror — *unless* you make her a jump-scare, which would trigger "fear/horror" descriptors.
- **Beer bottles as river litter → this is the one thing that raises your rating.** Any recognisable alcohol is treated harshly, especially by PEGI: **games that depict alcohol are pushed to PEGI 16/18**, and ESRB attaches an "Alcohol Reference" descriptor that typically lands you at **E10+ or higher**. The crocodile bite alone would *not* stop an all-ages rating; the beer bottles will.

**Target rating: it depends on whether you want the youngest bracket.**

- **If you keep recognisable beer bottles:** realistically **ESRB E10+ / PEGI 7 / Apple 9+ / Google Play "Rated for 7+".** Acceptable, but you lose the clean "for everyone / 4+" badge — and PEGI could push higher if the bottles read as clearly alcoholic.
- **If you want the broadest kid-friendly audience** (ESRB **E** / PEGI **3** / Apple **4+** / Google Play "Everyone"), make these **2–3 changes**:
  1. **De-brand / replace the bottles** — turn the "beer" litter into generic unlabelled plastic or soda bottles / "river junk." This removes the alcohol descriptor entirely and is the **single highest-leverage change**, especially for PEGI. You keep the anti-litter message; you drop the rating trigger.
  2. **Keep the crocodile bite bloodless and comic** — no red, no death animation. Keeps violence in the "comic/cartoon" tier that all-ages ratings allow.
  3. **Keep River Mumma mystical/neutral, not a horror scare** — avoids fear descriptors.

Do those three and you can honestly self-declare on the IARC questionnaire for the lowest bracket. **My recommendation:** de-brand the bottles and target **E / PEGI 3 / 4+**. The social-commentary value of "beer bottles specifically" is low; the audience cost of excluding under-10s and every school/family channel is high — and a kid-clean rating protects the TJP brand halo.

---

## 3. Monetization in Jamaica — ethical, non-extractive

**Recommendation: sponsorship-first, tips-second, cosmetics-maybe-later. Collect locally with Lynk; use PayPal only for the diaspora.**

The hard truth about your audience: many are on prepaid data and modest incomes, and a chunk don't hold the international cards that app-store IAP assumes. So the question isn't just "what's ethical" — it's "**what actually collects money in Jamaica.**" Those two answers happen to point the same way.

### What to do

| Option | Verdict | Honest pros / cons |
|---|---|---|
| **Local sponsorship / brand partner** (Flow, Digicel, a bank, tourism board, real craft vendors) | **Primary.** Best fit for your reality. | One B2B deal > thousands of J$100 payments, needs almost no payment infra, and you already have the muscle (TJP's award + reach + a government contract). Risk: don't wreck the vibe — integrate *in-world and tasteful* (a Flow billboard along the road, a real craft-vendor stall as a level set-piece), never a pop-up that covers the screen. |
| **"Support the dev" tip** (Lynk, PayPal, Ko-fi/Buy Me a Coffee) | **Yes — day one.** | Honest, on-brand, zero coercion. Won't fund a business, but it's free to add and signals whether people value it. |
| **One-time low price** (unlock full game) | **Optional.** | Fair and clean. But web can't easily gate a "paid download," so implement as an optional unlock, and note that a paywall on an unproven game kills the audience you need first. Better as "free, tip if you like it." |
| **Cosmetic-only IAP** (character skins, the boat/yacht as a *look*, not an advantage) | **Later, if it earns it.** | Ethically fine — cosmetics are the non-extractive model. But it needs accounts + payment backend + a store, which is real solo-dev overhead. Don't build this before there's a crowd. The yacht must stay a *flex*, never a *power-up* (see below). |
| **Rewarded ads** (opt-in "watch to continue / revive") | **Sparingly, if at all.** | Only ever optional and capped. Remember every forced video **spends the player's data bundle** — that's a real cost you're imposing. One optional revive ad = fine. A wall of them = you've become the thing you didn't want to be. |
| **Merch + real-artisan tie-ins** (River Mumma art, craft goods via actual Jamaican vendors) | **Long-term brand play.** | Aligns perfectly with your ecosystem and values; not day-one income, but a strong halo and a way to route money to real makers. |

### What to avoid, and why (sharper for *this* audience)

- **Pay-to-win** — selling the yacht/vehicle as a dodging *advantage* corrodes fairness and punishes the players who can't pay. In a lower-income audience that reads as exploitative fast.
- **Aggressive interstitial ads** — the full-screen ad between runs burns data *and* trust. Double cost, guaranteed churn.
- **Loot boxes / gacha** — regulatory grey zone, ethically indefensible, and radioactive for a kid-friendly rating. Hard no.
- **Dark patterns** — fake countdown timers, "are you sure you want to disappoint the crocodile" guilt nags, buried unsubscribes. These would directly damage the TJP credibility that is your actual asset. Not worth it for micro-revenue.

### Payment reality — what actually collects money in JM

- **Lynk / LynkBiz** — Jamaica's digital wallet. LynkBiz is **web-based (no app needed), gives you a QR + dashboard, and can be integrated into a website.** This is your **realistic local rail** for tips or a small unlock in JMD. Sign-up is via `sales@lynk.us`.
- **PayPal (Jamaica)** — you *can receive*, but Jamaica **can't withdraw to a local bank account**; you cash out only to a linked **Visa/Mastercard**, with fees. Fine for **diaspora / international** supporters, clumsy for local micro-payments.
- **Stripe** — **does not support Jamaica-based accounts.** Don't design around it. (If you want card checkout locally, look at Caribbean gateways like WiPay — verify current terms before committing.)
- **Store IAP** — Google Play **does pay out to Jamaica by wire transfer**; **Apple's payout support for Jamaica is unconfirmed** in current docs — confirm before you ever pay the $99. Either way the store takes 15–30%, and card-based IAP fits the JM micro-payer poorly.

**So the honest answer:** money is most collectible here via **(a) a sponsor invoiced normally**, and **(b) Lynk for local tips/unlocks** — not via app-store IAP.

---

## Recommended sequence

1. **Ship the installable PWA now.** Free, offline-capable, one link, "Add to Home Screen." Launch it *through* TJP as content — that's your distribution. Add a low-key "support the dev" tip (Lynk + PayPal). No store, no rating step, no spend.
2. **Prove an audience, then test revenue.** Watch plays, retention, and shares for a few weeks. If it has legs, design **one clean in-world sponsor slot** and pitch **one** local partner (Flow / Digicel / tourism / a bank) using TJP's award and reach. That single deal is the real monetization test — not micro-payments.
3. **Only if it earns it:** de-brand the bottles to hold an all-ages rating, pay the **$25** Google Play fee, and wrap the PWA as a TWA for Play discoverability (run the IARC questionnaire then). **Defer iOS / the $99/year** until there's proven demand *and* you've confirmed Apple can pay a Jamaican developer.

Keep it in the content-and-brand lane until it has players. Don't build IAP, accounts, or store pipelines for a game nobody's playing yet.

---

## Sources

- [Google Play service fees / registration — Play Console Help](https://support.google.com/googleplay/android-developer/answer/112622?hl=en) · [Google Play $25 one-time fee + 12-tester rule (IconikAI)](https://www.iconikai.com/blog/google-play-developer-account-fee-2026)
- [Apple Developer Program membership ($99/yr) — Apple](https://developer.apple.com/programs/whats-included/) · [Apple Developer fee 2026 breakdown (Magora)](https://magora-systems.com/apple-developer-fee/)
- [IARC ratings definitions](https://globalratings.com/ratings-definitions/) · [International Age Rating Coalition — Wikipedia](https://en.wikipedia.org/wiki/International_Age_Rating_Coalition)
- [ESRB ratings guide & content descriptors](https://www.esrb.org/ratings-guide/) · [PEGI — what the labels mean](https://pegi.info/what-do-the-labels-mean)
- [Lynk for Business (LynkBiz)](https://www.lynk.us/lynk-for-business) · [LynkBiz launch — Jamaica Information Service](https://jis.gov.jm/new-lynkbiz-digital-platform-being-launched/)
- [PayPal Jamaica withdrawal options](https://www.paypal.com/jm/webapps/mpp/withdrawal-options) · [Does PayPal work in Jamaica? (OneSafe)](https://www.onesafe.io/blog/does-paypal-work-in-jamaica)
- [Google Play wire-transfer payouts (Jamaica supported)](https://support.google.com/googleplay/android-developer/answer/2700656?hl=en) · [Apple App Store Connect — receiving payments](https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments/)
