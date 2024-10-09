import { SessionProvider } from 'next-auth/react';
import '../styles/global.css';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import AOS from 'aos';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
