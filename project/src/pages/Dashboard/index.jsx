import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RUOLO_LABEL = {
  DIPENDENTE: "Dipendente",
  RESPONSABILE: "Responsabile amministrativo",
};

export function Dashboard() {
  const { user, isResponsabile } = useAuth();

  const cards = isResponsabile
    ? [
        { to: "/rimborsi", title: "Tutte le richieste", desc: "Visualizza, approva, rifiuta e liquida i rimborsi" },
        { to: "/statistiche", title: "Statistiche", desc: "Riepilogo per mese, categoria e dipendente" },
      ]
    : [
        { to: "/miei-rimborsi", title: "I miei rimborsi", desc: "Visualizza e filtra le tue richieste" },
        { to: "/rimborsi/nuova", title: "Nuova richiesta", desc: "Inserisci una nuova spesa da rimborsare" },
      ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        Benvenuto, {user?.nome} {user?.cognome}
      </h2>
      <p className="text-slate-500 mb-8">
        {RUOLO_LABEL[user?.ruolo]}:  Gestione richieste di rimborso spese aziendali
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-slate-400 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
