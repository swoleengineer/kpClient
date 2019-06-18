export const allBooksSearchOpen = {
  set: (val: boolean = false) => localStorage.setItem('all-books-search', `${val}`),
  get: (): boolean => localStorage.getItem('all-books-search') && localStorage.getItem('all-books-search') === 'true' ? true : false,
  clear: () => localStorage.removeItem('all-books-search')
}

export const allBooksViewBooks = {
  set: (val: boolean = false) => localStorage.setItem('all-books-view-books', `${val}`),
  get: (): boolean => localStorage.getItem('all-books-view-books') && localStorage.getItem('all-books-view-books') === 'true' ? true : false,
  clear: () => localStorage.removeItem('all-books-view-books')
}
