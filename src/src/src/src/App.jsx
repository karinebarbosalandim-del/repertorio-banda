import { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [fase, setFase] = useState("inicio"); // fases: inicio, votacao, resultado
  const [sugestoes, setSugestoes] = useState([]);
  const [novaSugestao, setNovaSugestao] = useState("");
  const [votos, setVotos] = useState({});
  const [musicasParaVotar, setMusicasParaVotar] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  function enviarSugestao() {
    if (!novaSugestao.trim()) return;
    setSugestoes([...sugestoes, novaSugestao.trim()]);
    setNovaSugestao("");
  }

  function iniciarVotacao() {
    const embaralhadas = [...sugestoes].sort(() => 0.5 - Math.random());
    setMusicasParaVotar(embaralhadas);
    setVotos({});
    setIndiceAtual(0);
    setFase("votacao");
  }

  function votar(gostou) {
    const musica = musicasParaVotar[indiceAtual];
    const novosVotos = { ...votos };
    if (!novosVotos[musica]) novosVotos[musica] = 0;
    if (gostou) novosVotos[musica] += 1;
    setVotos(novosVotos);
    setIndiceAtual(indiceAtual + 1);
    if (indiceAtual + 1 >= musicasParaVotar.length) {
      setFase("resultado");
    }
  }

  function exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Repertório", 20, 20);
    let y = 40;
    const ranking = Object.entries(votos)
      .sort((a, b) => b[1] - a[1])
      .map(([musica, votos]) => `${musica} — ${votos} voto(s)`);
    ranking.forEach((linha) => {
      doc.text(linha, 20, y);
      y += 10;
    });
    doc.save("repertorio.pdf");
  }

  function renderInicio() {
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
        <h1 style={{ textAlign: "center" }}>🎸 Repertório da Banda</h1>
        <input
          type="text"
          placeholder="Nome da música + artista"
          value={novaSugestao}
          onChange={(e) => setNovaSugestao(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 12,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviarSugestao();
          }}
        />
        <button
          onClick={enviarSugestao}
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Adicionar sugestão
        </button>

        <ul>
          {sugestoes.map((m, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {m}
            </li>
          ))}
        </ul>

        {sugestoes.length >= 3 && (
          <button
            onClick={iniciarVotacao}
            style={{
              padding: 10,
              width: "100%",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Começar votação
          </button>
        )}
      </div>
    );
  }

  function renderVotacao() {
    const musica = musicasParaVotar[indiceAtual];
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "auto",
          padding: 16,
          textAlign: "center",
        }}
      >
        <h2>{musica}</h2>
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => votar(true)}
            style={{
              padding: 10,
              marginRight: 20,
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              width: 100,
            }}
          >
            👍 Curtir
          </button>
          <button
            onClick={() => votar(false)}
            style={{
              padding: 10,
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              width: 100,
            }}
          >
            👎 Passar
          </button>
        </div>
        <p style={{ marginTop: 16 }}>
          Música {indiceAtual + 1} de {musicasParaVotar.length}
        </p>
      </div>
    );
  }

  function renderResultado() {
    const ranking = Object.entries(votos)
      .sort((a, b) => b[1] - a[1])
      .map(([musica, votos]) => ({ musica, votos }));
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
        <h2 style={{ textAlign: "center" }}>🏆 Resultado Final</h2>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {ranking.map((item, i) => (
            <li
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 4,
                marginBottom: 8,
                backgroundColor: item.votos >= 4 ? "#d4edda" : "white",
              }}
            >
              <strong>{item.musica}</strong> — {item.votos} voto(s){" "}
              {item.votos >= 4 && (
                <span
                  style={{
                    color: "#155724",
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  ✅ Match!
                </span>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={exportarPDF}
          style={{
            padding: 10,
            width: "100%",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginTop: 12,
          }}
        >
          📄 Exportar PDF
        </button>
      </div>
    );
  }

  if (fase === "inicio") return renderInicio();
  if (fase === "votacao") return renderVotacao();
  if (fase === "resultado") return renderResultado();

  return null;
}
