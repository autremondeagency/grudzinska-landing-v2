import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Phone,
  Mail,
  Filter,
  RefreshCw,
  ExternalLink,
  Check,
  X as XIcon,
  Search,
} from "lucide-react";

type LeadStatus = "new" | "contacted" | "won" | "lost";
type LeadSource = "landing" | "meta_lead_ad" | "other";

interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  source: LeadSource;
  name: string | null;
  phone: string | null;
  email: string | null;
  situation: string | null;
  message: string | null;
  consent: boolean;
  meta_lead_id: string | null;
  meta_form_id: string | null;
  meta_ad_id: string | null;
  meta_campaign_id: string | null;
  status: LeadStatus;
  notes: string | null;
  contacted_at: string | null;
  closed_at: string | null;
}

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Nowy",
  contacted: "Skontaktowany",
  won: "Udało się",
  lost: "Nie udało się",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-sage/15 text-sage-dark border-sage/30",
  contacted: "bg-amber-100 text-amber-800 border-amber-300",
  won: "bg-emerald-100 text-emerald-800 border-emerald-300",
  lost: "bg-rose-100 text-rose-800 border-rose-300",
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  landing: "Strona",
  meta_lead_ad: "Meta Ads",
  other: "Inne",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "przed chwilą";
  if (min < 60) return `${min} min temu`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h temu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d temu`;
  return formatDate(iso);
}

export default function Panel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [filterSource, setFilterSource] = useState<LeadSource | "all">("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads-list", {
        credentials: "include",
        cache: "no-store",
      });
      if (res.status === 401) {
        // Browser will prompt for Basic Auth — reload after first attempt
        setError("Wymagane logowanie");
        return;
      }
      if (!res.ok) {
        const txt = await res.text();
        setError(`Błąd: ${res.status} ${txt}`);
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function updateLead(
    id: string,
    patch: { status?: LeadStatus; notes?: string }
  ) {
    setUpdating(id);
    try {
      const res = await fetch("/api/lead-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        const txt = await res.text();
        alert(`Nie udało się zapisać: ${txt}`);
        return;
      }
      const data = await res.json();
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...data.lead } : l))
      );
    } catch (e) {
      alert(`Błąd: ${e instanceof Error ? e.message : "network"}`);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (filterStatus !== "all" && l.status !== filterStatus) return false;
      if (filterSource !== "all" && l.source !== filterSource) return false;
      if (q) {
        const hay = [l.name, l.phone, l.email, l.situation, l.message, l.notes]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filterStatus, filterSource, search]);

  const counts = useMemo(() => {
    const c = { all: leads.length, new: 0, contacted: 0, won: 0, lost: 0 };
    for (const l of leads) c[l.status]++;
    return c;
  }, [leads]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-warm-brown text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">Panel leadów</h1>
            <p className="text-white/60 text-sm">
              Anna Krawczyk-Grudzińska — CRM
            </p>
          </div>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Odśwież
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`p-4 rounded-xl border bg-white text-left transition ${
              filterStatus === "all"
                ? "border-sage shadow-md"
                : "border-warm-brown-light/40 hover:border-sage/40"
            }`}
          >
            <div className="text-xs text-warm-brown/60 uppercase tracking-wider">
              Wszystkie
            </div>
            <div className="font-serif text-3xl text-warm-brown">
              {counts.all}
            </div>
          </button>
          {(["new", "contacted", "won", "lost"] as LeadStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`p-4 rounded-xl border bg-white text-left transition ${
                filterStatus === s
                  ? "border-sage shadow-md"
                  : "border-warm-brown-light/40 hover:border-sage/40"
              }`}
            >
              <div className="text-xs text-warm-brown/60 uppercase tracking-wider">
                {STATUS_LABEL[s]}
              </div>
              <div className="font-serif text-3xl text-warm-brown">
                {counts[s]}
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/40"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po imieniu, telefonie, mailu, treści..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-warm-brown-light/40 text-warm-brown placeholder:text-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-warm-brown/60" />
            <select
              value={filterSource}
              onChange={(e) =>
                setFilterSource(e.target.value as LeadSource | "all")
              }
              className="px-3 py-2 rounded-full bg-white border border-warm-brown-light/40 text-sm text-warm-brown focus:outline-none focus:ring-2 focus:ring-sage/30"
            >
              <option value="all">Wszystkie źródła</option>
              <option value="landing">Strona (formularz)</option>
              <option value="meta_lead_ad">Meta Lead Ads</option>
              <option value="other">Inne</option>
            </select>
          </div>
        </div>

        {/* Errors / loading */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {loading && filtered.length === 0 && (
          <div className="text-center py-20 text-warm-brown/50">Ładuję...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-warm-brown/60">
            <p className="text-lg">Brak leadów spełniających filtry.</p>
            <p className="text-sm mt-2">
              Pierwsze leady pojawią się tu po wypełnieniu formularza lub po
              odpowiedzi na reklamę Meta Lead Ads.
            </p>
          </div>
        )}

        {/* Lead list */}
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-warm-brown-light/40 p-5 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-warm-brown text-lg">
                      {lead.name || "(bez imienia)"}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUS_LABEL[lead.status]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-brown/8 text-warm-brown/70">
                      {SOURCE_LABEL[lead.source]}
                    </span>
                  </div>
                  <div className="text-xs text-warm-brown/55 mb-3">
                    {timeAgo(lead.created_at)} · {formatDate(lead.created_at)}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sand rounded-full text-warm-brown hover:bg-sage/15 transition"
                      >
                        <Phone size={13} /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sand rounded-full text-warm-brown hover:bg-sage/15 transition"
                      >
                        <Mail size={13} /> {lead.email}
                      </a>
                    )}
                    {lead.situation && (
                      <span className="px-3 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-sm">
                        {lead.situation}
                      </span>
                    )}
                  </div>

                  {lead.message && (
                    <p className="mt-3 text-sm text-warm-brown/75 leading-relaxed border-l-2 border-sage/30 pl-3 italic">
                      {lead.message}
                    </p>
                  )}

                  {/* Notes */}
                  <div className="mt-4">
                    {editingNotesId === lead.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          rows={2}
                          placeholder='Dodaj notatkę (np. "dzwoniłam 14:00, oddzwoni"). Notatki tylko dla Was — nie dla Anny.'
                          className="w-full px-3 py-2 rounded-lg bg-cream border border-warm-brown-light/50 text-sm text-warm-brown placeholder:text-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-sage/30"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await updateLead(lead.id, { notes: notesDraft });
                              setEditingNotesId(null);
                            }}
                            disabled={updating === lead.id}
                            className="text-xs px-3 py-1.5 bg-sage text-white rounded-full hover:bg-sage-dark disabled:opacity-50"
                          >
                            <Check size={12} className="inline mr-1" />
                            Zapisz
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="text-xs px-3 py-1.5 bg-warm-brown/10 text-warm-brown rounded-full hover:bg-warm-brown/20"
                          >
                            <XIcon size={12} className="inline mr-1" />
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingNotesId(lead.id);
                          setNotesDraft(lead.notes || "");
                        }}
                        className="text-xs text-warm-brown/60 hover:text-sage-dark"
                      >
                        {lead.notes
                          ? `📝 ${lead.notes}`
                          : "+ Dodaj notatkę"}
                      </button>
                    )}
                  </div>

                  {lead.source === "meta_lead_ad" && (
                    <div className="mt-2 text-xs text-warm-brown/40">
                      Meta lead {lead.meta_lead_id} ·{" "}
                      {lead.meta_campaign_id && `kampania ${lead.meta_campaign_id}`}
                    </div>
                  )}
                </div>

                {/* Status actions */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <div className="relative">
                    <select
                      value={lead.status}
                      disabled={updating === lead.id}
                      onChange={(e) =>
                        updateLead(lead.id, {
                          status: e.target.value as LeadStatus,
                        })
                      }
                      className="w-full appearance-none px-4 py-2.5 pr-10 rounded-full bg-cream border border-warm-brown-light/50 text-sm text-warm-brown font-medium focus:outline-none focus:ring-2 focus:ring-sage/30 cursor-pointer"
                    >
                      <option value="new">Nowy</option>
                      <option value="contacted">Skontaktowany</option>
                      <option value="won">Udało się</option>
                      <option value="lost">Nie udało się</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-brown/40 pointer-events-none"
                    />
                  </div>

                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition"
                    >
                      <Phone size={14} /> Zadzwoń
                    </a>
                  )}
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-warm-brown-light text-warm-brown text-sm font-medium hover:border-sage hover:text-sage-dark transition"
                    >
                      <Mail size={14} /> Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-xs text-warm-brown/50">
          <a
            href="/"
            className="inline-flex items-center gap-1 hover:text-sage-dark"
          >
            <ExternalLink size={12} /> Strona główna
          </a>
        </div>
      </main>
    </div>
  );
}
