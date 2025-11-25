// sanity/schemaTypes/dres.ts
export default {
  name: "dres",
  title: "Dres",
  type: "document",
  fields: [
    {
      name: "ime",
      title: "Ime dresa",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "klub",
      title: "Klub",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "velikost",
      title: "Velikost",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "cenaProdaje",
      title: "Cena prodaje (€)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "nabavnaCena",
      title: "Nabavna cena (€)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "zaloga",
      title: "Zaloga",
      type: "number",
      initialValue: 1,
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "slika",
      title: "Slika dresa",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "userEmail",
      title: "Lastnik (uporabnik)",
      type: "string",
      readOnly: true,
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "ime",
      subtitle: "klub",
      media: "slika",
    },
  },
};