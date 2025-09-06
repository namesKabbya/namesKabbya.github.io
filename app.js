

import React, { useEffect, useState } from "https://esm.sh/react@18";

function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("mangekyou_tracker_items");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem("mangekyou_intro_shown") !== "true";
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("anime");
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("mangekyou_tracker_items", JSON.stringify(items));
  }, [items]);

  function addItem(e) {
    e?.preventDefault();
    if (!title.trim()) return;
    const newItem = {
      id: Date.now() + Math.random().toString(36).slice(2, 9),
      title: title.trim(),
      category,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    setItems((s) => [newItem, ...s]);
    setTitle("");
    setNotes("");
  }

  function removeItem(id) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  function exportCSV() {
    const header = ["id", "title", "category", "notes", "createdAt"];
    const rows = items.map((it) => [
      it.id,
      `"${it.title.replace(/"/g, '""')}"`,
      it.category,
      `"${(it.notes || "").replace(/"/g, '""')}"`,
      it.createdAt,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mangekyou_watchlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(items.map((it) => it.id));
          const toAdd = parsed.filter((it) => !existingIds.has(it.id)).map((it) => ({
            id: it.id || Date.now() + Math.random().toString(36).slice(2, 9),
            title: it.title || "",
            category: it.category || "anime",
            notes: it.notes || "",
            createdAt: it.createdAt || new Date().toISOString(),
          }));
          setItems((s) => [...toAdd, ...s]);
        } else {
          alert("Imported JSON must be an array of items.");
        }
      } catch (err) {
        alert("Could not import JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  const filtered = items.filter((it) => {
    if (filter !== "all" && it.category !== filter) return false;
    if (query && !it.title.toLowerCase().includes(query.toLowerCase()) && !(it.notes || "").toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function handleAwaken() {
    localStorage.setItem("mangekyou_intro_shown", "true");
    setShowIntro(false);
    document.documentElement.classList.add("mangekyou-flash");
    setTimeout(() => document.documentElement.classList.remove("mangekyou-flash"), 900);
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 antialiased">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="60%" stopColor="#050505" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#rg1)" />
          <g transform="translate(400,300)">
            <g style={{ transformOrigin: '0 0', animation: 'spin 18s linear infinite' }}>
              <circle r="160" stroke="#8B0000" strokeWidth="1.8" fill="none" opacity="0.06" />
              <circle r="120" stroke="#2b021f" strokeWidth="2" fill="none" opacity="0.05" />
              <circle r="80" stroke="#560000" strokeWidth="1.5" fill="none" opacity="0.04" />
            </g>
          </g>
        </svg>
      </div>

      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative p-6 rounded-2xl max-w-xl w-full text-center">
            <div className="mb-6">
              <svg viewBox="0 0 200 200" className="mx-auto w-56 h-56">
                <defs>
                  <radialGradient id="eyeGrad" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#ffeded" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#2b0000" stopOpacity="0.9" />
                  </radialGradient>
                </defs>
                <g>
                  <circle cx="100" cy="100" r="80" fill="url(#eyeGrad)" filter="url(#glow)" />
                  <g style={{ animation: 'mandala 2s ease-in-out infinite' }}>
                    <path d="M100 30 C115 50, 170 70, 100 170 C30 70, 85 50, 100 30Z" fill="#1f0303" opacity="0.8" />
                    <circle cx="100" cy="100" r="24" fill="#000" />
                    <circle cx="100" cy="100" r="10" fill="#ff4d4d" />
                  </g>
                </g>
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-wider">Mangekyou Awakening</h2>
            <p className="mt-2 text-sm text-gray-300">When the eye opens, the tracker listens. Add what you've watched and it will be remembered forever in local storage.</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button onClick={handleAwaken} className="px-5 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-semibold shadow">Awaken</button>
              <button onClick={() => { setShowIntro(false); localStorage.setItem("mangekyou_intro_shown", "true"); }} className="px-4 py-2 bg-white/10 rounded-lg">Skip</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <header className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center text-2xl font-extrabold">MG</div>
          <div>
            <h1 className="text-2xl font-bold">Mangekyou Watchlist</h1>
            <div className="text-xs text-gray-400">Records games, anime, movies & dramas (saved locally)</div>
          </div>
          <div className="ml-auto text-sm text-gray-400">Total: <span className="font-semibold text-gray-100">{items.length}</span></div>
        </header>

        <form onSubmit={addItem} className="bg-white/5 p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name of anime, movie, game..." className="w-full mt-1 p-2 rounded bg-black/60 border border-white/6" />
          </div>
          <div>
            <label className="text-xs text-gray-300">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 rounded bg-black/60 border border-white/6">
              <option value="anime">Anime</option>
              <option value="movie">Movie</option>
              <option value="drama">Drama</option>
              <option value="game">Game</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-300">&nbsp;</label>
            <button type="submit" className="w-full py-2 rounded bg-red-700 hover:bg-red-600">Add</button>
          </div>
          <div className="md:col-span-4">
            <label className="text-xs text-gray-300">Notes (optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Short note or episode/level" className="w-full mt-1 p-2 rounded bg-black/60 border border-white/6" />
          </div>
        </form>

        <div className="flex gap-3 mb-4 items-center">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or notes..." className="p-2 rounded bg-black/60 border border-white/6 flex-1" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded bg-black/60 border border-white/6">
            <option value="all">All</option>
            <option value="anime">Anime</option>
            <option value="movie">Movie</option>
            <option value="drama">Drama</option>
            <option value="game">Game</option>
          </select>
          <button type="button" onClick={exportCSV} className="px-3 py-2 rounded bg-white/6">Export CSV</button>
          <label className="px-3 py-2 rounded bg-white/6 cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importJSON(e.target.files[0])} />
          </label>
          <button type="button" onClick={() => { setItems([]); localStorage.removeItem('mangekyou_tracker_items'); }} className="px-3 py-2 rounded bg-white/6">Clear</button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="p-6 rounded bg-white/3 text-gray-300">No entries yet — add something and the Mangekyou will remember it.</div>
          )}
          {filtered.map((it) => (
            <div key={it.id} className="p-3 rounded bg-white/3 flex items-start gap-3">
              <div className="w-12 h-12 rounded flex items-center justify-center bg-black/60 text-sm font-bold border border-white/6">
                {it.category[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-xs text-gray-400 px-2 py-1 bg-white/5 rounded">{it.category}</div>
                </div>
                <div className="text-xs text-gray-300 mt-1">{it.notes}</div>
                <div className="text-xs text-gray-500 mt-1">Added: {new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigator.clipboard?.writeText(`${it.title} — ${it.category}`)} className="px-2 py-1 rounded bg-white/6 text-xs">Copy</button>
                <button onClick={() => removeItem(it.id)} className="px-2 py-1 rounded bg-red-700 text-xs">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">Built with a hint of chakra. This project stores data locally in your browser only.</footer>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mandala { 0% { transform: scale(0.98) rotate(0deg);} 50% { transform: scale(1.02) rotate(6deg);} 100% { transform: scale(0.98) rotate(0deg);} }
        .mangekyou-flash { animation: flash 0.9s ease-in-out; }
        @keyframes flash { 0% { filter: hue-rotate(0deg) saturate(1);} 50% { filter: hue-rotate(200deg) saturate(1.6);} 100% { filter: hue-rotate(0deg) saturate(1);} }
      `}</style>
    </div>
  );
}

export default App;


import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
