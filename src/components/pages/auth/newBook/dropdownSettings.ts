import { ItemPredicate } from '@blueprintjs/select';
import { IAuthor } from '../../../../state-management/models'

const filterAuthor: ItemPredicate<IAuthor> = (query, author, _index, exactMatch) => {
  const normalizedName = author.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return exactMatch
    ? normalizedName === normalizedQuery
    : normalizedName.includes(normalizedQuery);
}

export const authorSettings = {
  allowCreate: true,
  closeOnSelect: true,
  minimal: true,
  openOnKeyDown: true,
  resetOnClose: true,
  resetOnQuery: false,
  resetOnSelect: false,
  itemPredicate: filterAuthor
}
