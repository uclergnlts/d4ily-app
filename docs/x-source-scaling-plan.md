# X Source Scaling Plan

## Goal

The product goal is not simply to collect many tweets. The goal is to catch the daily agenda accurately, including low-volume signals that appear on only one watched account.

Current baseline:

- Active X accounts: 500+
- Short-term target: 750
- Medium-term target: 1000+

## Source Mix Target

For 1000+ accounts, keep the source graph balanced:

- Official institutions, ministries, agencies, regulators: 120
- Governors, municipalities, mayors, local administrations: 150
- Parties, parliament groups, MPs, party executives: 180
- Journalists and beat reporters: 180
- Media, agencies, fast news accounts: 120
- NGOs, unions, professional chambers, rights organizations: 100
- Economy, finance, markets, business world: 70
- Foreign policy, defense, regional conflict: 50
- Sports clubs, reporters, federations: 50
- Local media and local crisis sources: 80

## Fetch Tiers

Use priority and interval to control cost and freshness:

- Priority 5: critical official/safety sources, 5-10 minutes
- Priority 4: high-impact agenda sources, 10-15 minutes
- Priority 3: normal agenda sources, 20 minutes
- Priority 2: long-tail/local/support sources, 30-60 minutes

Default cron batch:

- `TWITTER_ACCOUNTS_PER_RUN=75`
- Run every 10 minutes in production.

With 1000 accounts, a full sweep is about 14 runs, or roughly 140 minutes at 10-minute cadence. Critical sources still rotate sooner through shorter fetch intervals and higher priority.

## Quality Rules

- Never filter out a source just because it is single-source.
- Single-source signals must remain visible as `needsConfirmation` or `singleSourceAlerts`.
- AI must write only from evidence included in the signal package.
- Every AI-written story should carry evidence, source strength, quality score, what we know, and what still needs confirmation.

## Expansion Workflow

1. Add candidate sources by category in `scripts/seed-500-source-candidates.mjs`.
2. Seed local DB and check category distribution.
3. Force-fetch a sample from each new category.
4. Check `/api/v1/coverage`.
5. Check `/api/v1/package`.
6. Check `/api/v1/ai/briefing`.
7. Promote or demote priorities based on actual signal quality.

## Watch Metrics

- Active account count
- Accounts with tweets in 24h
- Never fetched accounts
- Due accounts
- Accounts per cron run
- Estimated full sweep runs
- Single-source signal count
- Needs-confirmation count
- AI story quality score distribution
