import { defineField, defineType } from "sanity";

const dres = defineType({
  name: "dres",
  title: "Dres",
  type: "document",
  fields: [
    defineField({
      name: "ime",
      title: "Ime dresa",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "klub",
      title: "Klub",
      type: "string",
    }),
    defineField({
      name: "velikost",
      title: "Velikost",
      type: "string",
    }),
    defineField({
      name: "cenaProdaje",
      title: "Cena prodaje (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "nabavnaCena",
      title: "Nabavna cena (€)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "na_zalogi",
      options: {
        list: [
          { title: "V prihodu", value: "v_prihodu" },
          { title: "Na zalogi", value: "na_zalogi" },
          { title: "Prodan", value: "prodan" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zaloga",
      title: "Zaloga",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "slika",
      title: "Slika dresa",
      type: "image",
      options: { hotspot: true },
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
      title: "ime",
      subtitle: "status",
      media: "slika",
    },
  },
});

export default dres;
