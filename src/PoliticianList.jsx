import { useEffect, useState, useMemo } from "react";

function PoliticianList() {
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

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

  const filter = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return politicians;
    return politicians.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const bio = (p.biograph || "").toLowerCase();
      return name.includes(q) || bio.includes(q);
    });
  }, [politicians, query]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;
  if (politicians.length === 0) return <p>Nessun politico trovato</p>;
  return (
    <div className="container">
      <h1 className="title">Politici</h1>
      <div className="search">
        <input type="text" placeholder="Cerca nome o bio" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
        <span className="search-count">Risultati: {filter.length}</span>
      </div>
      <ul className="cards">
        {filter.map((p) => (
          <li className="card" key={p.id}>
            {p.image && <img className="card-img" src={p.image} alt={p.name} />}
            <h3 className="card-name">{p.name}</h3>
            <p className="card-position">{p.position}</p>
            <p className="card-bio">{p.biography}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PoliticianList;
