const MESSAGGI = {
  "Authentication credentials were not provided.": "Autenticazione richiesta. Effettua il login.",
  "You do not have permission to perform this action.": "Non hai i permessi per eseguire questa operazione.",
  "Not found.": "Risorsa non trovata.",
  "Given token not valid for any token type": "Token non valido o scaduto. Effettua di nuovo il login.",
  "Token is invalid or expired": "Token non valido o scaduto. Effettua di nuovo il login.",
  "No active account found with the given credentials": "Credenziali non valide. Verifica email e password.",
  "This field is required.": "Questo campo è obbligatorio.",
  "This field may not be blank.": "Questo campo non può essere vuoto.",
  "Enter a valid email address.": "Inserisci un indirizzo email valido.",
  "NetworkError when attempting to fetch resource.": "Impossibile contattare il server. Verifica la connessione.",
  "Failed to fetch": "Impossibile contattare il server. Verifica la connessione.",
};

const CAMPI = {
  email: "Email",
  password: "Password",
  conferma_password: "Conferma password",
  nome: "Nome",
  cognome: "Cognome",
  ruolo: "Ruolo",
  data_spesa: "Data spesa",
  importo: "Importo",
  descrizione: "Descrizione",
  categoria: "Categoria",
  riferimento_giustificativo: "Riferimento giustificativo",
  non_field_errors: "Errori",
  detail: "Errore",
};

function traduciTesto(testo) {
  if (typeof testo !== "string") return testo;
  if (MESSAGGI[testo]) return MESSAGGI[testo];
  for (const [eng, ita] of Object.entries(MESSAGGI)) {
    if (testo.includes(eng)) return testo.replace(eng, ita);
  }
  if (testo.startsWith("Ensure this field has no more than")) {
    return "Il valore inserito è troppo lungo.";
  }
  if (testo.includes("object does not exist")) {
    return "Il valore selezionato non esiste.";
  }
  return testo;
}

function messaggioDetail(data) {
  const detail = data.detail ?? data.Errore;
  if (!detail) return null;
  if (Array.isArray(detail)) return traduciTesto(detail[0]);
  return traduciTesto(detail);
}

export function formatApiError(data) {
  if (!data) return "Errore sconosciuto.";
  if (typeof data === "string") return traduciTesto(data);
  const detail = messaggioDetail(data);
  if (detail) return detail;

  return Object.entries(data)
    .map(([field, messages]) => {
      const label = CAMPI[field] || field;
      const text = Array.isArray(messages)
        ? messages.map(traduciTesto).join(" ")
        : traduciTesto(messages);
      return field === "detail" ? text : `${label}: ${text}`;
    })
    .join(" ");
}
