"use client";

import { useState, useEffect } from "react";
import {
  CreditCard, PlusCircle, Pencil, Trash2, Copy, Check,
  Building2, Smartphone, X, Save, AlertTriangle, Eye, EyeOff
} from "lucide-react";

interface PaymentAccount {
  id: string; label: string; accountTitle: string;
  accountNumber: string; type: string; logoUrl?: string | null;
  isActive: boolean; sortOrder: number;
}

const TYPE_OPTS = ["BANK", "EASYPAISA", "JAZZCASH", "OTHER"];
const TYPE_ICONS: Record<string, React.ReactNode> = {
  BANK: <Building2 className="w-4 h-4" />,
  EASYPAISA: <Smartphone className="w-4 h-4" />,
  JAZZCASH: <Smartphone className="w-4 h-4" />,
  OTHER: <CreditCard className="w-4 h-4" />,
};
const TYPE_COLORS: Record<string, string> = {
  BANK: "bg-blue-50 text-blue-700 border-blue-200",
  EASYPAISA: "bg-green-50 text-green-700 border-green-200",
  JAZZCASH: "bg-red-50 text-red-700 border-red-200",
  OTHER: "bg-slate-50 text-slate-700 border-slate-200",
};

const EMPTY: Partial<PaymentAccount> = {
  label: "", accountTitle: "", accountNumber: "", type: "BANK", logoUrl: "", sortOrder: 0, isActive: true
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button" title="Copy"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="ml-1 p-1 rounded hover:bg-[var(--brand-50)] text-[var(--text-tertiary)] hover:text-[var(--brand-600)] transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="elegant-card w-full max-w-lg animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-strong)]">
          <h3 className="text-lg font-black text-[var(--text-primary)]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-red-50 rounded-full text-[var(--text-tertiary)] hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<Partial<PaymentAccount>>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/payment-accounts");
    if (res.ok) setAccounts(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowModal(true); };
  const openEdit = (a: PaymentAccount) => { setForm({ ...a }); setEditingId(a.id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.label || !form.accountTitle || !form.accountNumber || !form.type) {
      showMsg("❌ Please fill all required fields."); return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch("/api/admin/payment-accounts", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showMsg(editingId ? "✅ Account updated!" : "✅ Account added!");
      setShowModal(false); await load();
    } catch (err: any) { showMsg("❌ " + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await fetch("/api/admin/payment-accounts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirmDel }) });
    showMsg("🗑️ Account removed."); setConfirmDel(null); await load();
  };

  const toggleActive = async (a: PaymentAccount) => {
    await fetch("/api/admin/payment-accounts", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...a, isActive: !a.isActive })
    });
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Payment Methods</h1>

      {/* Confirm Delete */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="elegant-card p-8 max-w-sm w-full text-center animate-fade-up">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-xl font-black mb-2">Delete Account?</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">This cannot be undone. Students won't see this account on the register page.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editingId ? "Edit Payment Account" : "Add Payment Account"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Account Label *</label>
                <input value={form.label || ""} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Meezan Bank" className="elegant-input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Type *</label>
                <select value={form.type || "BANK"} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="elegant-input text-sm bg-white">
                  {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Account Title / Holder Name *</label>
              <input value={form.accountTitle || ""} onChange={e => setForm(p => ({ ...p, accountTitle: e.target.value }))}
                placeholder="e.g. Muhammad Admin" className="elegant-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Account Number / IBAN / Phone *</label>
              <input value={form.accountNumber || ""} onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))}
                placeholder="e.g. 0300-1234567" className="elegant-input text-sm font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Logo URL or Emoji</label>
                <input value={form.logoUrl || ""} onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))}
                  placeholder="https://... or 🏦" className="elegant-input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">Sort Order</label>
                <input type="number" min="0" value={form.sortOrder ?? 0} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) }))}
                  className="elegant-input text-sm" />
              </div>
            </div>
            {editingId && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-[var(--brand-600)]" />
                <span className="text-sm font-bold text-[var(--text-secondary)]">Show on Register Page (Active)</span>
              </label>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 h-11">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />{editingId ? "Update Account" : "Add Account"}</>}
            </button>
          </div>
        </Modal>
      )}

      {/* Main Card */}
      <div className="elegant-card overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between">
          <h2 className="text-base font-black text-[var(--text-primary)]">Payment Methods</h2>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <PlusCircle className="w-4 h-4" /> + Add Method
          </button>
        </div>

        {msg && <div className={`mx-6 mt-4 p-3 rounded-xl text-sm font-bold ${msg.startsWith("✅") || msg.startsWith("🗑️") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

        <div className="p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-[var(--text-tertiary)]">Loading...</div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
              <CreditCard className="w-14 h-14 text-[var(--border-strong)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2">No Payment Methods Yet</h3>
              <p className="text-[var(--text-tertiary)] text-sm mb-5">Add bank/mobile accounts for students to see when registering.</p>
              <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2"><PlusCircle className="w-4 h-4" />Add First Account</button>
            </div>
          ) : (
            accounts.map((acc, i) => (
              <div key={acc.id} className={`elegant-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up transition-opacity ${!acc.isActive ? "opacity-50" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center shrink-0 text-2xl overflow-hidden border border-[var(--border-strong)]">
                  {acc.logoUrl && acc.logoUrl.startsWith("http")
                    ? <img src={acc.logoUrl} className="w-10 h-10 object-contain" alt={acc.label} />
                    : acc.logoUrl
                      ? <span>{acc.logoUrl}</span>
                      : <span className="text-[var(--text-tertiary)]">{TYPE_ICONS[acc.type] || <CreditCard className="w-5 h-5" />}</span>
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-[var(--text-primary)]">{acc.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${TYPE_COLORS[acc.type] || "bg-slate-50 text-slate-700 border-slate-200"}`}>{acc.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-lg px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">
                    Account Name: {acc.accountTitle}{"\n"}Account Number: {acc.accountNumber}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button title="Delete" onClick={() => setConfirmDel(acc.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
