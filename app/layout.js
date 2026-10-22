import './globals.css';
export const metadata = { title: 'Tartan Tickets | Your next campus plan', description: 'A student-built campus events prototype for CMU 70-445.' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
