import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/PageHeader";

const RUOLO_LABEL = {
  DIPENDENTE: "Dipendente",
  RESPONSABILE: "Responsabile amministrativo",
};

export function Dashboard() {
  const { user, isResponsabile } = useAuth();

  const cards = isResponsabile
    ? [
        {
          to: "/rimborsi",
          title: "Tutte le richieste",
          desc: "Visualizza, approva, rifiuta e liquida i rimborsi",
          num: "01",
        },
        {
          to: "/statistiche",
          title: "Statistiche",
          desc: "Riepilogo per mese, categoria e dipendente",
          num: "02",
        },
      ]
    : [
        {
          to: "/miei-rimborsi",
          title: "I miei rimborsi",
          desc: "Visualizza e filtra le tue richieste",
          num: "01",
        },
        {
          to: "/rimborsi/nuova",
          title: "Nuova richiesta",
          desc: "Inserisci una nuova spesa da rimborsare",
          num: "02",
        },
      ];

  return (
    <div>
      <PageHeader
        title={`Ciao, ${user?.nome}`}
        subtitle={`${RUOLO_LABEL[user?.ruolo]} — gestione richieste di rimborso spese aziendali`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="card-accent card-pad group hover:shadow-md hover:border-l-slate-600 transition-all duration-200"
          >
            <span className="font-display text-4xl font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
              {card.num}
            </span>
            <h3 className="font-display text-xl font-bold text-slate-800 mt-3 mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:underline">
              Apri →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
