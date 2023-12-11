import NextAuth from 'next-auth';
import { options } from './options'
import { urlToHttpOptions } from 'url';

const handler = NextAuth(options);

export { handler as GET, handler as POST };