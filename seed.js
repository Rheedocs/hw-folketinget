const mongoose = require('mongoose');
const Person = require('./src/models/person');

// Ministre fra Mikkels liste: [name, title, party]
const ministers = [
    ["Mette Frederiksen", "Statsminister", "S"],
    ["Pia Olsen Dyhr", "Økonomi- og indenrigsminister", "SF"],
    ["Lars Løkke Rasmussen", "Udenrigsminister", "M"],
    ["Martin Lidegaard", "Erhvervs- og konkurrencekraftsminister", "RV"],
    ["Peter Hummelgaard", "Finansminister", "S"],
    ["Nicolai Wammen", "Justitsminister", "S"],
    ["Christina Egelund", "Forsknings-, uddannelses- og digitaliseringsminister", "M"],
    ["Samira Nawa", "Klima-, energi- og forsyningsminister", "RV"],
    ["Karina Lorentzen Dehnhardt", "By-, land- og transportminister", "SF"],
    ["Morten Bødskov", "Udlændinge- og integrationsminister", "S"],
    ["Magnus Heunicke", "Undervisningsminister", "S"],
    ["Ane Halsboe-Jørgensen", "Beskæftigelsesminister og minister for ligestilling", "S"],
    ["Jeppe Bruus", "Forsvarsminister", "S"],
    ["Jakob Engel-Schmidt", "Skatte- og vækstminister", "M"],
    ["Ida Auken", "Sundhedsminister og kirkeminister", "S"],
    ["Christian Rabjerg Madsen", "Minister for natur og dyrevelfærd", "S"],
    ["Zenia Stampe", "Kulturminister", "RV"],
    ["Lisbeth Bech-Nielsen", "Minister for samfundssikkerhed og beredskab", "SF"],
    ["Jacob Mark", "Børne-, ældre- og boligminister", "SF"],
    ["Monika Rubin", "Socialminister og minister for nordisk samarbejde", "M"],
    ["Maria Reumert Gjerding", "Miljøminister", "SF"]
];

// Partiformænd fra ft.dk (Hvem er hvad i Folketinget): [name, party]
const leaders = [
    ["Mette Frederiksen", "S"],
    ["Pia Olsen Dyhr", "SF"],
    ["Troels Lund Poulsen", "V"],
    ["Morten Messerschmidt", "DF"],
    ["Alex Vanopslagh", "LA"],
    ["Lars Løkke Rasmussen", "M"],
    ["Mona Juul", "KF"],
    ["Inger Støjberg", "DD"],
    ["Anne Heeager", "RV"],
    ["Franciska Rosenkilde", "ALT"],
    ["Lars Boje Mathiesen", "BP"]
];

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/folketingDB');

    const ministerDocs = ministers.map(([name, title, party]) => ({
        name,
        title,
        party,
        position: 'minister'
    }));
    const leaderDocs = leaders.map(([name, party]) => ({
        name,
        party,
        position: 'formand'
    }));

    // Sletter kun vores egne positioner, så scriptet kan køres igen uden dubletter
    await Person.deleteMany({ position: { $in: ['minister', 'formand'] } });
    await Person.insertMany([...ministerDocs, ...leaderDocs]);

    console.log(`${ministerDocs.length} ministre og ${leaderDocs.length} formænd gemt`);
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('Fejl:', err.message);
    process.exit(1);
});