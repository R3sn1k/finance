# Finance - dresi ⚽💰

**Popoln finančni pregled nad prodajo nogometnih dresov**

Enostavna in pregledna spletna aplikacija za spremljanje prihodkov, odhodkov, dobička in števila prodaj. Idealna za samostojne prodajalce dresov ali manjše ekipe.

## ✨ Glavne funkcionalnosti

- 📊 **Dashboard** z letnim ciljem dobička in progress barom
- 💰 Kartice s prihodki, odhodki, dobičkom in številom prodaj
- 📈 Interaktivni linijski grafi po mesecih (dobiček, prihodki, odhodki, prodaje)
- 🧾 Zgodovina transakcij z iskanjem, filtriranjem (tip, datum) in paginacijo
- ➕ Dodajanje transakcij (instant osvežitev)
- 🗑️ Instant brisanje posameznih transakcij in celotnega računa
- 👤 Urejanje profila (uporabniško ime, geslo, profilna slika, letni cilj)
- 📱 **Popolnoma responsive** – odlično deluje na telefonu in tablici
- 🔒 Middleware zaščita poti (prijavljeni ne vidijo login/registracije in obratno)

## 🛠 Lokalni zagon

```bash
git clone https://github.com/tvoj-username/finance-dresovi.git
cd finance-dresovi

npm install

cp .env.example .env.local   # dodaj svoje Sanity ključe
npm run dev
