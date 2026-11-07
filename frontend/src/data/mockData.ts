import { AuditIssue, CodeOptimizationDiff, Experiment, KeywordData, MemoryRecord, PagePerformance, Website } from "../types";

export const SAMPLE_WEBSITES: Website[] = [
  {
    id: "acme-corp",
    domain: "acme.com",
    name: "Acme Cloud Platform",
    healthScore: 92,
    gscConnected: false, // matches backend adapter default
    githubConnected: false,
    lastAudit: "12 mins ago",
    trafficTrend: 14.8,
    crawlStatus: "Healthy",
    pagesCount: 1420,
  },
  {
    id: "example-site",
    domain: "example.com",
    name: "Example Global Portal",
    healthScore: 78,
    gscConnected: false,
    githubConnected: false,
    lastAudit: "2 hours ago",
    trafficTrend: -3.2,
    crawlStatus: "Warnings",
    pagesCount: 480,
  },
  {
    id: "dev-portal",
    domain: "docs.acme.com",
    name: "Acme Developer Docs",
    healthScore: 96,
    gscConnected: false,
    githubConnected: false,
    lastAudit: "Yesterday",
    trafficTrend: 28.4,
    crawlStatus: "Healthy",
    pagesCount: 3100,
  },
];

// 30 days traffic telemetry data
export const TRAFFIC_TREND_DATA = [
  { date: "Oct 08", clicks: 1240, impressions: 38200, ctr: 3.24, position: 14.2 },
  { date: "Oct 11", clicks: 1310, impressions: 39500, ctr: 3.31, position: 13.9 },
  { date: "Oct 14", clicks: 1290, impressions: 41200, ctr: 3.13, position: 13.8 },
  { date: "Oct 17", clicks: 1450, impressions: 43100, ctr: 3.36, position: 13.2 },
  { date: "Oct 20", clicks: 1520, impressions: 45000, ctr: 3.37, position: 12.8 },
  { date: "Oct 23", clicks: 1480, impressions: 44200, ctr: 3.34, position: 12.9 },
  { date: "Oct 26", clicks: 1610, impressions: 47800, ctr: 3.36, position: 12.4 },
  { date: "Oct 29", clicks: 1730, impressions: 50400, ctr: 3.43, position: 11.9 },
  { date: "Nov 01", clicks: 1820, impressions: 52100, ctr: 3.49, position: 11.6 },
  { date: "Nov 04", clicks: 1940, impressions: 54800, ctr: 3.54, position: 11.2 },
  { date: "Nov 07", clicks: 2120, impressions: 58200, ctr: 3.64, position: 10.8 },
];

export const TOP_PAGES_DATA: PagePerformance[] = [
  { url: "/blog/autonomous-agentic-seo-architecture", clicks: 8420, impressions: 142000, ctr: 5.9, position: 3.2, change: 4.1 },
  { url: "/features/ai-technical-audits", clicks: 5120, impressions: 98400, ctr: 5.2, position: 4.6, change: 1.8 },
  { url: "/solutions/enterprise-indexing-engine", clicks: 4210, impressions: 84000, ctr: 5.0, position: 5.1, change: -0.4 },
  { url: "/pricing", clicks: 3940, impressions: 45000, ctr: 8.7, position: 1.8, change: 0.2 },
  { url: "/docs/getting-started-langgraph-seo", clicks: 3120, impressions: 64200, ctr: 4.8, position: 6.4, change: 2.3 },
  { url: "/blog/hindsight-memory-for-search-algorithms", clicks: 2840, impressions: 72100, ctr: 3.9, position: 7.8, change: 3.9 },
];

export const KEYWORDS_DATA: KeywordData[] = [
  { query: "autonomous seo agent", clicks: 3420, impressions: 48900, ctr: 6.99, position: 2.4, previousPosition: 5.2, intent: "Commercial", opportunityScore: 94 },
  { query: "hindsight memory seo optimization", clicks: 2180, impressions: 31200, ctr: 6.98, position: 1.8, previousPosition: 3.1, intent: "Transactional", opportunityScore: 98 },
  { query: "ai search console indexing speed", clicks: 1840, impressions: 42100, ctr: 4.37, position: 6.1, previousPosition: 9.4, intent: "Informational", opportunityScore: 88 },
  { query: "langgraph programmatic technical seo", clicks: 1420, impressions: 24800, ctr: 5.72, position: 4.3, previousPosition: 4.5, intent: "Commercial", opportunityScore: 79 },
  { query: "automated schema markup generator api", clicks: 1290, impressions: 38900, ctr: 3.31, position: 8.9, previousPosition: 12.1, intent: "Transactional", opportunityScore: 86 },
  { query: "core web vitals automation github action", clicks: 980, impressions: 19400, ctr: 5.05, position: 5.7, previousPosition: 7.2, intent: "Informational", opportunityScore: 72 },
  { query: "saas programmatic seo architecture", clicks: 840, impressions: 28100, ctr: 2.98, position: 11.2, previousPosition: 14.8, intent: "Informational", opportunityScore: 91 },
  { query: "enterprise site crawl budget optimizer", clicks: 610, impressions: 16500, ctr: 3.69, position: 7.8, previousPosition: 7.9, intent: "Commercial", opportunityScore: 68 },
];

export const AUDIT_ISSUES: AuditIssue[] = [
  {
    id: "issue-1",
    severity: "critical",
    category: "Schema",
    title: "Missing SoftwareApplication & Article JSON-LD markup",
    description: "42 key landing pages lack structured metadata required for Google Rich Snippets and AI Overview citation inclusion.",
    urlsAffected: 42,
    recommendation: "Inject schema.org SoftwareApplication and Article schemas dynamically via Next.js Head or Astro layout.",
    impactScore: 94,
    resolved: false,
  },
  {
    id: "issue-2",
    severity: "critical",
    category: "Technical",
    title: "Duplicate canonical tags on parameterized query URLs",
    description: "Search bots are receiving conflicting canonical declarations on faceted navigation pages, diluting index equity.",
    urlsAffected: 18,
    recommendation: "Sanitize canonical generation in route middleware to always reference normalized root paths.",
    impactScore: 89,
    resolved: false,
  },
  {
    id: "issue-3",
    severity: "high",
    category: "Performance",
    title: "Largest Contentful Paint (LCP) exceeds 2.8s on Mobile",
    description: "Hero banner WebP images are not preloaded and client JS bundles block first content render.",
    urlsAffected: 65,
    recommendation: "Add rel='preload' as='image' to high-priority hero elements and defer non-critical analytics tags.",
    impactScore: 78,
    resolved: false,
  },
  {
    id: "issue-4",
    severity: "medium",
    category: "Content",
    title: "Missing or truncated OpenGraph & meta description tags",
    description: "14 documentation pages have meta descriptions exceeding 160 characters or completely absent.",
    urlsAffected: 14,
    recommendation: "Auto-generate concise 140-155 character descriptions using LLM agent summary pipeline.",
    impactScore: 62,
    resolved: false,
  },
  {
    id: "issue-5",
    severity: "low",
    category: "Technical",
    title: "Unminified robots.txt crawl directives",
    description: "Robots.txt contains obsolete test staging disallow paths from previous deployment cycle.",
    urlsAffected: 1,
    recommendation: "Clean up staging directives and add explicit sitemap.xml index location.",
    impactScore: 40,
    resolved: true,
  },
];

export const HINDSIGHT_MEMORIES: MemoryRecord[] = [
  {
    id: "mem-rec-001",
    timestamp: "Nov 06, 2026 18:42",
    action: "reflect",
    context: "website:acme.com",
    summary: "Meta title rewrite for /pricing reduced CTR by 12% in US market",
    details: "When evaluating title tag changes for commercial intent queries, historical reflection indicates aggressive marketing keywords ('Cheap SaaS') underperformed versus feature-focused titles ('Enterprise Cloud Infrastructure').",
    confidence: 0.94,
    influence: "Directly vetoed marketing-heavy title suggestion on Nov 07 audit and preserved technical trust keywords.",
    outcome: "improved",
  },
  {
    id: "mem-rec-002",
    timestamp: "Nov 04, 2026 09:15",
    action: "retain",
    context: "customer:acme-corp",
    summary: "JSON-LD FAQPage inclusion led to +31% SERP snippet CTR lift",
    details: "Experiment exp-882 proved adding 3-4 structured FAQ schemas on technical guide pages consistently triggers rich snippet displays without cannibalizing click-through rate.",
    confidence: 0.98,
    influence: "Prioritized JSON-LD injection as #1 recommended automated pull request for documentation subpaths.",
    outcome: "improved",
  },
  {
    id: "mem-rec-003",
    timestamp: "Oct 28, 2026 14:02",
    action: "recall",
    context: "website:acme.com",
    summary: "Disallowing /api/v1/docs in robots.txt broke Google rendering",
    details: "Googlebot requires access to API response schema assets to render interactive documentation. Disallow directive caused indexing drops across 80 API specification pages.",
    confidence: 0.96,
    influence: "Rule check validator now blocks any automated robots.txt recommendation that disallows /docs or /api documentation trees.",
    outcome: "declined",
  },
  {
    id: "mem-rec-004",
    timestamp: "Oct 21, 2026 11:30",
    action: "retain",
    context: "customer:acme-corp",
    summary: "Preloading Inter Variable font reduced CLS from 0.18 to 0.02",
    details: "Font swap layout shift was major contributor to poor Core Web Vitals score on mobile devices. Injecting woff2 preload tags fixed mobile ranking penalty.",
    confidence: 0.91,
    influence: "Automatic CSS/HTML patch generator now includes font preload headers by default.",
    outcome: "improved",
  },
  {
    id: "mem-rec-005",
    timestamp: "Oct 15, 2026 16:50",
    action: "reflect",
    context: "website:acme.com",
    summary: "Internal anchor text variation prevents keyword over-optimization flag",
    details: "Repeating exact-match anchor text 'cloud server' triggered rank turbulence. Shifting to natural semantic variants ('cloud computing infrastructure', 'scalable virtual machines') stabilized positions.",
    confidence: 0.88,
    influence: "Agent internal linking generator applies semantic diversity algorithm before proposing markdown edits.",
    outcome: "improved",
  },
];

export const CODE_OPTIMIZATION_DIFFS: CodeOptimizationDiff[] = [
  {
    id: "diff-001",
    filePath: "frontend/app/layout.tsx",
    title: "Inject Schema.org SoftwareApplication Structured Data",
    category: "Structured Data",
    originalCode: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Acme Cloud Platform</title>
        <meta name="description" content="Enterprise cloud infrastructure" />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    proposedCode: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Acme Cloud Platform",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "128"
    }
  };

  return (
    <html lang="en">
      <head>
        <title>Acme Cloud Platform — Autonomous Infrastructure</title>
        <meta name="description" content="Enterprise cloud infrastructure with automated high availability." />
        <link rel="canonical" href="https://acme.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`,
    aiExplanation: "Hindsight recalled exp-882: Structured JSON-LD metadata qualifies acme.com for Google Rich Snippets with star rating and pricing metadata, historically boosting search CTR by +31%. Also adds missing canonical tag.",
    validationStatus: "passed",
    validationMessage: "Syntax verified. Schema.org schema validator passed with 0 errors, 0 warnings. Safe automated patch.",
    githubBranch: "seo/schema-software-app-enrichment",
    prStatus: "Ready to PR",
    approvalStatus: "pending",
  },
  {
    id: "diff-002",
    filePath: "public/robots.txt",
    title: "Update Robots Directives and Sitemap Index",
    category: "Robots.txt",
    originalCode: `User-agent: *
Disallow: /api/
Disallow: /staging/
Disallow: /admin/
`,
    proposedCode: `User-agent: *
Disallow: /api/auth/
Disallow: /admin/
Allow: /api/docs/

Sitemap: https://acme.com/sitemap.xml
Sitemap: https://acme.com/sitemap-blog.xml
`,
    aiExplanation: "Reflected learning from mem-rec-003: Relaxed blanket /api/ disallow to explicitly allow /api/docs/ for Googlebot rendering, while keeping secure endpoints protected.",
    validationStatus: "passed",
    validationMessage: "Robots standard compliance 100%. No accidental disallow of indexable assets.",
    githubBranch: "seo/robots-txt-allow-api-docs",
    prStatus: "Approved",
    approvalStatus: "approved",
  },
];

export const BENCHMARK_EXPERIMENTS: Experiment[] = [
  {
    experiment_id: "exp-882",
    website_id: "acme.com",
    name: "JSON-LD FAQ & SoftwareApplication Schema Injection",
    hypothesis: "Injecting rich structured data on high-traffic landing pages will increase SERP CTR by > 15%",
    proposed_change: "Added SoftwareApplication and FAQPage JSON-LD schemas in root layout.",
    status: "improved",
    outcome: "executed",
    baseline_metric: { name: "CTR", value: 3.2, unit: "%" },
    measured_metric: { name: "CTR", value: 4.8, unit: "%", lift_pct: 50.0 },
    execution: { status: "completed", executed_at: "2026-10-24T14:30:00Z" },
    measurement: { status: "recorded", result: "+1.6% absolute CTR lift observed over 14 day observation window." },
    learning_insight: "Hindsight memory retained: Google AI Overviews cite pages with structured data 2.4x more frequently.",
    created_at: "2026-10-24",
  },
  {
    experiment_id: "exp-791",
    website_id: "acme.com",
    name: "Font Preloading & LCP Resource Prioritization",
    hypothesis: "Preloading critical woff2 font will decrease mobile Largest Contentful Paint to < 2.0s",
    proposed_change: "Injected <link rel='preload'> for Inter variable font and deferred heavy analytics script.",
    status: "improved",
    outcome: "executed",
    baseline_metric: { name: "LCP", value: 2.9, unit: "s" },
    measured_metric: { name: "LCP", value: 1.7, unit: "s", lift_pct: 41.3 },
    execution: { status: "completed", executed_at: "2026-10-18T10:15:00Z" },
    measurement: { status: "recorded", result: "Core Web Vitals mobile pass rate increased from 64% to 98%." },
    learning_insight: "LCP improvement yielded a +1.4 average position boost for competitive mobile search queries.",
    created_at: "2026-10-18",
  },
  {
    experiment_id: "exp-650",
    website_id: "acme.com",
    name: "Commercial Title Tag Tone Rewrite",
    hypothesis: "Changing title tag to 'Cheapest Enterprise Cloud' will boost commercial CTR",
    proposed_change: "Rewrote title tags across 12 product pages to emphasize price over reliability.",
    status: "declined",
    outcome: "executed",
    baseline_metric: { name: "Organic Clicks", value: 14200, unit: "clicks" },
    measured_metric: { name: "Organic Clicks", value: 12500, unit: "clicks", lift_pct: -12.0 },
    execution: { status: "completed", executed_at: "2026-10-02T08:00:00Z" },
    measurement: { status: "recorded", result: "CTR dropped 12% due to perceived reduction in enterprise trust." },
    learning_insight: "Hindsight rule formed: Never sacrifice enterprise credibility language for discount phrases.",
    created_at: "2026-10-02",
  },
];

