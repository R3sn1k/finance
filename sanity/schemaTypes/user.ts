import { defineType, defineField } from 'sanity';

export default defineType({
  name: "user",
  title: "Users",
  type: "document",
  fields: [
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "password",
      type: "string",
      title: "Hashed Password",
      validation: (rule) => rule.required(),
    }),
  ],
});
