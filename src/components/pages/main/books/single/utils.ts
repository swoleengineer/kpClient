import axios from 'axios';
const grKey = `z01qAkrKfrJoo2tR5EuLfQ`;
const grUrl = (isbn: string): string => ` https://www.goodreads.com/book/isbn/${isbn}?format=json&key=${grKey}`;

export const getGoodReadsData = (isbn: string) => axios.get(grUrl(isbn));
