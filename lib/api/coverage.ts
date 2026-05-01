import { sql } from "drizzle-orm"

import { db } from "@/lib/db"

type TwitterAccountRow = {
  username: string
  display_name: string | null
  category: string | null
  priority: number
  trust_score: number
  is_official: number | boolean
  fetch_interval: number
  last_fetched_at: string | null
  last_fetch_started_at: string | null
  last_fetch_completed_at: string | null
  last_success_at: string | null
  last_error_at: string | null
  last_error_message: string | null
  last_seen_tweet_id: string | null
  last_seen_tweet_published_at: string | null
  consecutive_error_count: number
  total_fetch_count: number
  total_error_count: number
}

type TweetRow = {
  author_username: string | null
  published_at: string | null
  fetched_at: string | null
}

function parseDate(value: string | null) {
  if (!value) return null

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function minutesSince(value: string | null) {
  const parsed = parseDate(value)
  if (!parsed) return null

  return Math.round((Date.now() - parsed.getTime()) / 60000)
}

function sourceKey(value: string | null) {
  return value?.replace(/^@/, "").toLocaleLowerCase("tr-TR").trim() ?? ""
}

export async function getCoverageReport() {
	  const accounts = await db.all(sql`
	    SELECT
	      username,
	      display_name,
	      category,
	      priority,
	      trust_score,
	      is_official,
	      fetch_interval,
	      last_fetched_at,
	      last_fetch_started_at,
	      last_fetch_completed_at,
	      last_success_at,
	      last_error_at,
	      last_error_message,
	      last_seen_tweet_id,
	      last_seen_tweet_published_at,
	      consecutive_error_count,
	      total_fetch_count,
	      total_error_count
	    FROM twitter_accounts
	    WHERE is_active = 1
	    ORDER BY priority DESC, trust_score DESC, username ASC
	  `) as TwitterAccountRow[]

  const tweetRows = await db.all(sql`
    SELECT author_username, published_at, fetched_at
    FROM tweets_raw
    ORDER BY id DESC
    LIMIT 5000
  `) as TweetRow[]

  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const tweetStats = new Map<string, {
    tweets24h: number
    lastPublishedAt: string | null
    lastFetchedTweetAt: string | null
  }>()

  for (const tweet of tweetRows) {
    const key = sourceKey(tweet.author_username)
    if (!key) continue

    const publishedAt = parseDate(tweet.published_at)
    if (!publishedAt || publishedAt.getTime() < cutoff) continue

    const current = tweetStats.get(key) || {
      tweets24h: 0,
      lastPublishedAt: null,
      lastFetchedTweetAt: null,
    }

    current.tweets24h += 1

    if (!current.lastPublishedAt || publishedAt.getTime() > (parseDate(current.lastPublishedAt)?.getTime() ?? 0)) {
      current.lastPublishedAt = publishedAt.toISOString()
    }

    const fetchedAt = parseDate(tweet.fetched_at)
    if (fetchedAt && (!current.lastFetchedTweetAt || fetchedAt.getTime() > (parseDate(current.lastFetchedTweetAt)?.getTime() ?? 0))) {
      current.lastFetchedTweetAt = fetchedAt.toISOString()
    }

    tweetStats.set(key, current)
  }

	  const accountCoverage = accounts.map((account) => {
    const key = sourceKey(account.username)
    const stats = tweetStats.get(key)
    const lastFetchAgeMinutes = minutesSince(account.last_fetched_at)
    const fetchInterval = account.fetch_interval || 20
    const isDue = lastFetchAgeMinutes === null || lastFetchAgeMinutes >= fetchInterval
	    const lastSuccessAgeMinutes = minutesSince(account.last_success_at)
	    const lastStartedAt = parseDate(account.last_fetch_started_at)
	    const lastCompletedAt = parseDate(account.last_fetch_completed_at)
	    const hasStuckFetch = Boolean(
	      lastStartedAt &&
	      (!lastCompletedAt || lastStartedAt.getTime() > lastCompletedAt.getTime()) &&
	      Date.now() - lastStartedAt.getTime() > 15 * 60 * 1000,
	    )
	    const notScannedWithin24h = lastSuccessAgeMinutes === null || lastSuccessAgeMinutes > 24 * 60
	    const hasRecentErrors = account.consecutive_error_count > 0
	
	    return {
      username: account.username,
      displayName: account.display_name,
      category: account.category,
      priority: account.priority,
      trustScore: account.trust_score,
      isOfficial: Boolean(account.is_official),
      fetchIntervalMinutes: fetchInterval,
	      lastFetchedAt: parseDate(account.last_fetched_at)?.toISOString() ?? account.last_fetched_at,
	      lastFetchStartedAt: parseDate(account.last_fetch_started_at)?.toISOString() ?? account.last_fetch_started_at,
	      lastFetchCompletedAt: parseDate(account.last_fetch_completed_at)?.toISOString() ?? account.last_fetch_completed_at,
	      lastSuccessAt: parseDate(account.last_success_at)?.toISOString() ?? account.last_success_at,
	      lastErrorAt: parseDate(account.last_error_at)?.toISOString() ?? account.last_error_at,
	      lastErrorMessage: account.last_error_message,
	      lastSeenTweetId: account.last_seen_tweet_id,
	      lastSeenTweetPublishedAt: parseDate(account.last_seen_tweet_published_at)?.toISOString() ?? account.last_seen_tweet_published_at,
	      lastFetchAgeMinutes,
	      lastSuccessAgeMinutes,
	      isDue,
	      notScannedWithin24h,
	      hasRecentErrors,
	      hasStuckFetch,
	      consecutiveErrorCount: account.consecutive_error_count,
	      totalFetchCount: account.total_fetch_count,
	      totalErrorCount: account.total_error_count,
	      tweets24h: stats?.tweets24h ?? 0,
      lastPublishedAt: stats?.lastPublishedAt ?? null,
      lastFetchedTweetAt: stats?.lastFetchedTweetAt ?? null,
      hasTweets24h: (stats?.tweets24h ?? 0) > 0,
    }
  })

  const accountsWithTweets24h = accountCoverage.filter((account) => account.hasTweets24h)
  const zeroTweetAccounts24h = accountCoverage.filter((account) => !account.hasTweets24h)
	  const neverFetchedAccounts = accountCoverage.filter((account) => !account.lastFetchedAt)
	  const dueAccounts = accountCoverage.filter((account) => account.isDue)
	  const notScannedWithin24h = accountCoverage.filter((account) => account.notScannedWithin24h)
	  const accountsWithRecentErrors = accountCoverage.filter((account) => account.hasRecentErrors)
	  const stuckFetchAccounts = accountCoverage.filter((account) => account.hasStuckFetch)
  const defaultAccountsPerRun = Number.parseInt(process.env.TWITTER_ACCOUNTS_PER_RUN || "75", 10)
  const accountsPerRun = Number.isNaN(defaultAccountsPerRun) ? 75 : Math.max(1, defaultAccountsPerRun)
  const estimatedRunsForFullSweep = Math.ceil(accountCoverage.length / accountsPerRun)
  const categoryCoverage = [...accountCoverage.reduce((acc, account) => {
    const category = account.category || "uncategorized"
    const current = acc.get(category) || {
      category,
      activeAccounts: 0,
      accountsWithTweets24h: 0,
      notScannedWithin24h: 0,
      accountsWithRecentErrors: 0,
      averageTrustScore: 0,
      officialAccounts: 0,
      coverageScore: 0,
    }

    current.activeAccounts += 1
    current.accountsWithTweets24h += account.hasTweets24h ? 1 : 0
    current.notScannedWithin24h += account.notScannedWithin24h ? 1 : 0
    current.accountsWithRecentErrors += account.hasRecentErrors ? 1 : 0
    current.averageTrustScore += account.trustScore
    current.officialAccounts += account.isOfficial ? 1 : 0
    acc.set(category, current)
    return acc
  }, new Map<string, {
    category: string
    activeAccounts: number
    accountsWithTweets24h: number
    notScannedWithin24h: number
    accountsWithRecentErrors: number
    averageTrustScore: number
    officialAccounts: number
    coverageScore: number
  }>()).values()].map((item) => {
    const activeRatio = item.activeAccounts > 0 ? item.accountsWithTweets24h / item.activeAccounts : 0
    const scannedRatio = item.activeAccounts > 0 ? (item.activeAccounts - item.notScannedWithin24h) / item.activeAccounts : 0
    const errorPenalty = item.activeAccounts > 0 ? item.accountsWithRecentErrors / item.activeAccounts : 0
    const averageTrustScore = item.activeAccounts > 0 ? item.averageTrustScore / item.activeAccounts : 0

    return {
      ...item,
      averageTrustScore: Math.round(averageTrustScore * 10) / 10,
      coverageScore: Math.max(0, Math.min(100, Math.round(activeRatio * 35 + scannedRatio * 45 + (averageTrustScore / 5) * 20 - errorPenalty * 20))),
    }
  }).sort((left, right) => right.coverageScore - left.coverageScore)
  const overallCoverageScore = accountCoverage.length > 0
    ? Math.round(
        ((accountsWithTweets24h.length / accountCoverage.length) * 35) +
        (((accountCoverage.length - notScannedWithin24h.length) / accountCoverage.length) * 45) +
        ((accountCoverage.reduce((sum, account) => sum + account.trustScore, 0) / accountCoverage.length / 5) * 20) -
        ((accountsWithRecentErrors.length / accountCoverage.length) * 20),
      )
    : 0

  return {
    windowHours: 24,
    generatedAt: new Date().toISOString(),
    summary: {
      activeTwitterAccounts: accounts.length,
      accountsWithTweets24h: accountsWithTweets24h.length,
      zeroTweetAccounts24h: zeroTweetAccounts24h.length,
	      neverFetchedAccounts: neverFetchedAccounts.length,
	      dueAccounts: dueAccounts.length,
	      notScannedWithin24h: notScannedWithin24h.length,
	      accountsWithRecentErrors: accountsWithRecentErrors.length,
	      stuckFetchAccounts: stuckFetchAccounts.length,
	      accountsPerRun,
      estimatedRunsForFullSweep,
      sourceCoverageScore: Math.max(0, Math.min(100, overallCoverageScore)),
      categoryCount: categoryCoverage.length,
    },
    sourceCoverage: {
      overallScore: Math.max(0, Math.min(100, overallCoverageScore)),
      categories: categoryCoverage,
      weakCategories: categoryCoverage.filter((item) => item.coverageScore < 55 || item.notScannedWithin24h > 0).slice(0, 30),
    },
    attention: {
	      zeroTweetAccounts24h: zeroTweetAccounts24h.slice(0, 50),
	      neverFetchedAccounts: neverFetchedAccounts.slice(0, 50),
	      dueAccounts: dueAccounts.slice(0, 50),
	      notScannedWithin24h: notScannedWithin24h.slice(0, 50),
	      accountsWithRecentErrors: accountsWithRecentErrors.slice(0, 50),
	      stuckFetchAccounts: stuckFetchAccounts.slice(0, 50),
	    },
    accounts: accountCoverage,
  }
}
