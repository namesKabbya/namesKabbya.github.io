const { useState, useEffect } = React;

function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (type) => {
    if (!input.trim()) return;
    setEntries([...entries, { id: Date.now(), type, title: input }]);
    setInput("");
  };

  const removeEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const filtered = entries.filter(
    (e) =>
      (filter === "all" || e.type === filter) &&
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500 animate-pulse">
        🔴 Mangekyou Watchlist 🔴
      </h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add title..."
        className="p-2 rounded text-black"
      />
      <div className="space-x-2 mt-2">
        <button onClick={() => addEntry("anime")} className="px-3 py-1 bg-red-600 rounded">Anime</button>
        <button onClick={() => addEntry("movie")} className="px-3 py-1 bg-blue-600 rounded">Movie</button>
        <button onClick={() => addEntry("drama")} className="px-3 py-1 bg-green-600 rounded">Drama</button>
        <button onClick={() => addEntry("game")} className="px-3 py-1 bg-purple-600 rounded">Game</button>
      </div>

      <div className="mt-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="p-2 rounded text-black"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ml-2 p-2 rounded text-black"
        >
          <option value="all">All</option>
          <option value="anime">Anime</option>
          <option value="movie">Movies</option>
          <option value="drama">Dramas</option>
          <option value="game">Games</option>
        </select>
      </div>

      <ul className="mt-4 space-y-2">
        {filtered.map((e) => (
          <li key={e.id} className="flex justify-between bg-gray-800 p-2 rounded">
            <span>[{e.type}] {e.title}</span>
            <button onClick={() => removeEntry(e.id)} className="text-red-400">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
