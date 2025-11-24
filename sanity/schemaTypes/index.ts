import post from '../schemaTypes/post'
import category from '../schemaTypes/category'
import author from '../schemaTypes/author'
import user from '../schemaTypes/user'

export const schema = {
  types: [user,post, category, author],
}
