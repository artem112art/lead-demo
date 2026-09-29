const sourceValues = new Set(["website", "referral", "social", "ads", "email", "other"]);

export function normalizeLead(input, now = new Date()) {
  const compact = (value) => String(value ?? "").trim().replace(/\s+/g, " ");
  const email = compact(input.email).toLowerCase();
  const digits = compact(input.phone).replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
  const phone = normalizedDigits ? `+${normalizedDigits}` : "";
  const rawSource = compact(input.source).toLowerCase();
  const source = sourceValues.has(rawSource) ? rawSource : "other";
  const parsedBudget = Number(input.budget);
  const budget = Number.isFinite(parsedBudget) && parsedBudget >= 0 ? parsedBudget : null;
  const seed = `${email}|${phone}|${compact(input.company)}|${now.getTime()}`;
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const leadId = `lead_${now.getTime().toString(36)}_${(hash >>> 0).toString(36)}`;

  return {
    lead_id: leadId,
    correlation_id: leadId,
    created_at: now.toISOString(),
    name: compact(input.name),
    company: compact(input.company),
    email,
    phone,
    service: compact(input.service),
    budget,
    message: compact(input.message),
    source,
    simulate_downstream_failure: Boolean(input.simulate_downstream_failure),
    status: "RECEIVED",
    approved: null,
    last_action: "NORMALIZED",
    error_count: 0
  };
}

export function validateLead(input) {
  const missing = [];
  if (!String(input.name ?? "").trim()) missing.push("name");
  if (!String(input.email ?? "").trim() && !String(input.phone ?? "").trim()) missing.push("email_or_phone");
  if (!String(input.message ?? "").trim()) missing.push("message");
  if (!String(input.source ?? "").trim()) missing.push("source");
  return { valid: missing.length === 0, errors: missing.map((field) => ({ field, code: "REQUIRED" })) };
}

export function qualifyLead(lead, hotThreshold = 70, warmThreshold = 40) {
  let score = 0;
  const reasons = [];
  const add = (points, reason) => { score += points; reasons.push({ points, reason }); };
  const clearTask = lead.message.length >= 40 && /(автомат|лид|запис|crm|интеграц|workflow|обработ|sales|support|booking)/i.test(lead.message);
  const spam = /(^|\s)(test|spam|asdf|qwerty|тест)(\s|$)/i.test(lead.message);

  if (lead.budget !== null && lead.budget > 0) add(25, "budget_provided");
  if (lead.budget !== null && lead.budget >= 300) add(15, "budget_at_least_300");
  if (clearTask) add(20, "clear_business_task");
  if (lead.company) add(15, "company_provided");
  if (lead.phone) add(10, "phone_provided");
  if (lead.email) add(10, "email_provided");
  if (["website", "referral"].includes(lead.source)) add(5, "high_intent_source");
  if (lead.message.length < 20) add(-20, "message_too_short");
  if (spam) add(-30, "spam_indicator");
  if (!lead.phone && !lead.email) add(-20, "no_contact");

  score = Math.max(0, Math.min(100, score));
  const tier = score >= hotThreshold ? "HOT" : score >= warmThreshold ? "WARM" : "COLD";
  const contact = lead.phone || lead.email || "no contact";
  const summary = `${lead.name}${lead.company ? ` from ${lead.company}` : ""} wants ${lead.service || "an automation solution"}. Budget: ${lead.budget ?? "not specified"}. Problem: ${lead.message}. Recommended action: ${tier === "HOT" ? "review and contact within 15 minutes" : tier === "WARM" ? "send a focused follow-up" : "retain for nurture without immediate notification"}.`;
  return { ...lead, lead_score: score, lead_tier: tier, score_reasons: reasons, summary, contact };
}
