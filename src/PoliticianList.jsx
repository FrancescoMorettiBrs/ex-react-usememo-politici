import { useEffect, useState } from "react";

function PoliticianList() {
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:3333/politicians");
        if (!res.ok) throw new Error("HTTP:", res.status);
        const data = await res.json();
        console.log(data);
        setPoliticians(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;
  if (politicians.length === 0) return <p>Nessun politico trovato</p>;
  return (
    <div className="container">
      <h1 className="title">Politici</h1>
      <ul className="cards">
        {politicians.map((p) => (
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
