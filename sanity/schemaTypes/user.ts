// sanity/schemaTypes/user.ts
export default {
  name: "user",
  title: "Uporabnik",
  type: "document",
  fields: [
    {
      name: "username",
      title: "Uporabniško ime",
      type: "string",
      validation: (Rule: any) => Rule.required().min(3),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "password",
      title: "Geslo",
      type: "string",
      validation: (Rule: any) => Rule.required().min(6),
    },
    {
      name: "profileImage",
      title: "Profilna slika",
      type: "image",
      options: { hotspot: true },
    },
  ],
};