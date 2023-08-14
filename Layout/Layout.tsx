import { LayoutProps } from './Layout.props';
import styles from './Layout.module.css';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';
import { Footer} from './Footer/Footer';
import { FunctionComponent, useState, KeyboardEvent, useRef } from 'react';
import { AppContextProvider, IAppContext } from '../context/app.contex';
import { Up } from '../components';
import cn from 'classnames';



const Layout = ({ children }: LayoutProps): JSX.Element => {

	const [isSkipLinkDisplayed, setIsSkipLinkDisplayed] = useState<boolean>(false);

	const bodyRef = useRef<HTMLDivElement>(null);

	const skipContentAction = (key: KeyboardEvent) => {
		if (key.code == 'Space' || key.code == 'Enter') {
			key.preventDefault();
			bodyRef.current?.focus();
		}
		setIsSkipLinkDisplayed(false);
	};

	return (
		<div className={styles.wrapper}>
			<a 
				className={cn(styles.skipLink, {
					[styles.displayed]: isSkipLinkDisplayed
				})}
				tabIndex={0}
				onFocus={() => setIsSkipLinkDisplayed(true)}
				onKeyDown={skipContentAction}
			>
				Сразу к содержанию
			</a>
			<Header className={styles.header}/>
			<Sidebar className={styles.sidebar}/>
			<main 
				className={styles.body}
				ref={bodyRef}
				tabIndex={0}
				role='main'	
			>
				{children}
			</main>	
			<Footer className={styles.footer}/>	
			<Up/>
		</div>
	);
};

// компонент высшего порядка который будет оборачивать нашу страницу в layout
export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
	return function withLayoutComponent(props: T):JSX.Element {
		return (
			//точка входа для обёртывания провайдера и исользования контекста 
			//передаём начальные значения через props для content
			<AppContextProvider menu={props.menu} firstCategory={props.firstCategory}>
				<Layout>
					<Component {...props} />
				</Layout>
			</AppContextProvider>
		);
	};
};