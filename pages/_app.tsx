import { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import { Router, useRouter } from 'next/router';
import ym from 'react-yandex-metrika';
import { YMInitializer } from 'react-yandex-metrika';

//Мы подписываемся на событие, что при каждом изменене роута будем отправлять инфу в Яндекс.Метрику
Router.events.on('routeChangeComplete', (url: string) => {
	if (typeof window !== 'undefined') {
		ym('hit', url);
	}
});


function MyApp({ Component, pageProps }: AppProps): JSX.Element {

	const router = useRouter();

	return <>
		<Head>
			<title>MyTop - наш лучший топ</title>
			<link rel="icon" href="/favicon.ico" />
			{/* устанавливаем шрифт */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link rel="preconnect" href="https://mc.yandex.ru" />
			<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
			<meta property='og:url' content={process.env.NEXT_PUBLIC_DOMAIN + router.asPath}/>
			<meta property='og:locale' content='ru_RU'/>
		</Head>
		<YMInitializer
			accounts={[]}
			options={{ webvisor: true, defer: true }}
			version='2'
		/>
		<Component {...pageProps} />
	</>;
}

export default MyApp;
