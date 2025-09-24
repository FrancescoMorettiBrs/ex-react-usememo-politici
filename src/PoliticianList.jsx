import React, { useEffect, useState, useMemo } from "react";

const PoliticianCard = React.memo(function PoliticianCard({ p }) {
  console.log("Renderizzazione Card:", p.id ?? p.name);
  return (
    <li className="card">
      {p.image && <img className="card-img" src={p.image} alt={p.name} />}
      <h3 className="card-title">{p.name}</h3>
      <p className="card-position">{p.position}</p>
      <p className="card-bio">{p.biography}</p>
    </li>
  );
});

function PoliticianList() {
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [positionFilter, setPoistionFilter] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:3333/politicians");
        if (!res.ok) throw new Error("HTTP:" + res.status);
        const data = await res.json();
        setPoliticians(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const positions = useMemo(() => {
    const set = new Set();
    for (const p of politicians) {
      const pos = p?.position?.trim();
      if (pos) set.add(pos);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [politicians]);

  const filter = useMemo(() => {
    const q = query.trim().toLowerCase();
    return politicians.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const bio = (p.biography || "").toLowerCase();
      const pos = p.position;
      const matchesText = !q || name.includes(q) || bio.includes(q);
      const matchesPos = !positionFilter || pos === positionFilter;
      return matchesText && matchesPos;
    });
  }, [politicians, query, positionFilter]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;
  if (politicians.length === 0) return <p>Nessun politico trovato</p>;

  return (
    <div className="container">
      <h1 className="title">Politici</h1>
      <div className="filters">
        <input type="text" placeholder="Cerca nome o bio" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
        <select value={positionFilter} onChange={(e) => setPoistionFilter(e.target.value)} className="select">
          <option value="">Tutte le posizioni</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <span className="search-count">Risultati: {filter.length}</span>
      </div>
      {filter.length === 0 ? (
        <p className="empty">Nessun risultato per "{query}"</p>
      ) : (
        <ul className="cards">
          {filter.map((p) => (
            <PoliticianCard key={p.id} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default PoliticianList;
