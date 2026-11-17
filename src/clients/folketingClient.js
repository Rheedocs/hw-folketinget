const BASE_URL = 'https://oda.ft.dk/api';

// Henter partiet for en person fra Folketingets åbne API.
// Returnerer { party } eller null, hvis personen ikke findes.
exports.fetchParty = async (name) => {
    const escaped = name.replace(/'/g, "''");
    const filter = encodeURIComponent(`typeid eq 5 and navn eq '${escaped}'`);
    const url = `${BASE_URL}/Akt%C3%B8r?%24filter=${filter}&%24format=json`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Folketingets API svarede ${response.status}`);
    }

    const data = await response.json();
    const person = data.value[0];
    if (!person) return null;

    const match = /<partyShortname>(.*?)<\/partyShortname>/.exec(person.biografi || '');
    return match ? { party: match[1] } : null;
};