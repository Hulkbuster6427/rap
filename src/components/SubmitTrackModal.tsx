import React, { useState } from 'react';
import { X, Send, Radio, CheckCircle } from 'lucide-react';

interface SubmitTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitTrackModal: React.FC<SubmitTrackModalProps> = ({ isOpen, onClose }) => {
  const [artistName, setArtistName] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [subgenre, setSubgenre] = useState('Plugg / PluggnB');
  const [editorialNote, setEditorialNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !trackUrl.trim()) return;

    // Simulate saving submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setArtistName('');
      setTrackUrl('');
      setEditorialNote('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-display font-bold text-xl text-zinc-100">
              Dispatch Received in Vault
            </h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Our curatorial team audits all submissions through direct audio monitoring. Thank you for keeping the underground alive.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <Radio className="w-4 h-4" />
              <span>Crate Digger Submission</span>
            </div>

            <h3 className="font-display font-bold text-2xl text-zinc-100">
              Submit an Underground Tip
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Know an emerging independent rapper, beat architect, or obscure micro-scene reshaping contemporary music? Send the audio document directly to our editorial desk.
            </p>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Artist / Collective Moniker *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SeshHollowWaterBoyz, BabyTron, Che"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                SoundCloud / Bandcamp / Track Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://soundcloud.com/... or https://bandcamp.com/..."
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Acoustic Micro-Genre
              </label>
              <select
                value={subgenre}
                onChange={(e) => setSubgenre(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:border-amber-400 focus:outline-none font-mono"
              >
                <option>Plugg / PluggnB</option>
                <option>Rage & Industrial Synth-Punk</option>
                <option>Michigan Off-Beat & Flint Bounce</option>
                <option>Drumless Soul & Vinyl Chops</option>
                <option>Digicore & Hyper-Rap</option>
                <option>Cloud Rap & Ambient Memphis</option>
                <option>Other / Unclassifiable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">
                Curatorial Context / Why It Matters
              </label>
              <textarea
                rows={3}
                placeholder="What sonic boundary does this artist break? How are they carving their own path?"
                value={editorialNote}
                onChange={(e) => setEditorialNote(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:border-amber-400 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Curators</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
