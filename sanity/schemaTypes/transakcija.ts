// sanity/schemas/transakcija.ts
export default {
  name: "transakcija",
  title: "Transakcija",
  type: "document",
  fields: [
    {
      name: "datum",
      title: "Datum",
      type: "datetime",
      initialValue: new Date().toISOString(),
    },
    {
      name: "tip",
      title: "Tip",
      type: "string",
      options: {
        list: [
          { title: "Prihodek", value: "prihodek" },
          { title: "Odhodek", value: "odhodek" },
        ],
      },
    },
    {
      name: "znesek",
      title: "Znesek (€)",
      type: "number",
      validation: (Rule: any) => Rule.positive(),
    },
    {
      name: "opis",
      title: "Opis",
      type: "string",
      description: "Npr. 'Prodaja – Ronaldo dres', 'Naročilo 20 dresov iz Kitajske', 'Poštnina'...",
    },
    {
      name: "userEmail",
      title: "Uporabnik",
      type: "string",
      hidden: true,
    },
  ],
  preview: {
    select: {
      tip: "tip",
      znesek: "znesek",
      opis: "opis",
      datum: "datum",
    },
    prepare({ tip, znesek, opis, datum }: any) {
      return {
        title: `${tip === "prihodek" ? "↑" : "↓"} ${znesek.toFixed(2)} € – ${opis}`,
        subtitle: new Date(datum).toLocaleDateString("sl-SI"),
      };
    },
  },
};