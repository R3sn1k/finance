export default {
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    { name: 'email', type: 'string', title: 'Email' },
    { name: 'password', type: 'string', title: 'Password' }, // hashano
  ],
}
