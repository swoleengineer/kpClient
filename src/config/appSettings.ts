export const allBooksSearchOpen = {
  set: (val: boolean = false) => localStorage.setItem('all-books-search', `${val}`),
  get: (): boolean => localStorage.getItem('all-books-search') && localStorage.getItem('all-books-search') === 'true' ? true : false,
  clear: () => localStorage.removeItem('all-books-search')
}
