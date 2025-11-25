import post from '../schemaTypes/post'
import category from '../schemaTypes/category'
import author from '../schemaTypes/author'
import user from '../schemaTypes/user'
import dres from "../schemaTypes/dres"
import prodaja from "../schemaTypes/prodaja"
import nakup from "../schemaTypes/nakup"

export const schema = {
  types: [dres, prodaja, nakup,user,post, category, author],
}
