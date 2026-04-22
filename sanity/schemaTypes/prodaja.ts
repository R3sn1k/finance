import { defineField, defineType } from "sanity";

const prodaja = defineType({
  name: "prodaja",
  title: "Prodaja dresa",
  type: "document",
  fields: [
    defineField({
      name: "dres",
      title: "Kateri dres",
      type: "reference",
      to: [{ type: "dres" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "datum",
      title: "Datum prodaje",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "cenaProdaje",
      title: "Skupna prodajna cena (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "kolicina",
      title: "Količina",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "opomba",
      title: "Opomba",
      type: "text",
    }),
    defineField({
      name: "userEmail",
      title: "Lastnik (uporabnik)",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "dres.ime",
      subtitle: "cenaProdaje",
      media: "dres.slika",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `${subtitle} €`,
        media,
      };
    },
  },
});

export default prodaja;
