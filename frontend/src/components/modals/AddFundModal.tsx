import { useState } from 'react';
import type { FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';

type AddFundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFund: (amount: number, reference?: string) => Promise<void>;
};

const AddFundModal = ({ isOpen, onClose, onFund }: AddFundModalProps) => {
  const [loading, setLoading] = useState(false);

  if (isOpen) {
    // eslint-disable-next-line no-console
    console.log('AddFundModal: rendered and open')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get('amount')) || 0;
    const reference = String(form.get('reference') || `manual-${Date.now()}`);
    setLoading(true);
    try {
      await onFund(amount, reference);
      onClose();
    } catch (err) {
      console.error('Failed to fund wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Funds</h3>
            <p className="text-xs text-slate-500">Top up your wallet balance</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Amount</span>
              <input name="amount" type="number" min="1" required className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 outline-none" />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Reference</span>
              <input name="reference" placeholder="Optional payment reference" className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 outline-none" />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Add Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundModal;
