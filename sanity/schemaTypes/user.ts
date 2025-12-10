export default {
  name: 'user',
  title: 'Uporabnik',
  type: 'document',
  fields: [
    {
      name: 'username',
      title: 'Uporabniško ime',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Geslo',
      type: 'string',
    },
    {
      name: 'profileImage',
      title: 'Profilna slika',
      type: 'image',
      options: { hotspot: true },
    },
    // NOVO: LETNI CILJ
    {
  name: "letniCiljDobicka",
  title: "Letni cilj dobička (€)",
  type: "number",
  initialValue: 25000,
  validation: (Rule: any) => Rule.min(0).positive()
}
  ],
};