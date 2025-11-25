// sanity/schemaTypes/nakup.ts
export default {
  name: "nakup",
  title: "Nakup / Naročilo dresov",
  type: "document",
  fields: [
    {
      name: "datum",
      title: "Datum naročila",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
    },
    {
      name: "dobavitelj",
      title: "Dobavitelj",
      type: "string",
    },
    {
      name: "znesek",
      title: "Skupni znesek (€)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "opis",
      title: "Kaj si naročil",
      type: "text",
    },
  ],
};