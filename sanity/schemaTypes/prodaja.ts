// sanity/schemaTypes/prodaja.ts
export default {
  name: "prodaja",
  title: "Prodaja dresa",
  type: "document",
  fields: [
    {
      name: "dres",
      title: "Kateri dres",
      type: "reference",
      to: [{ type: "dres" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "datum",
      title: "Datum prodaje",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "cenaProdaje",
      title: "Cena po kateri si prodal (€)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "opomba",
      title: "Opomba",
      type: "text",
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
      title: "dres.ime",
      subtitle: "cenaProdaje",
      media: "dres.slika",
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title,
        subtitle: `${subtitle} €`,
        media,
      };
    },
  },
};