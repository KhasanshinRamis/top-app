import { LayoutProps } from './Layout.props';
import styles from './Layout.module.css';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';
import { Footer} from './Footer/Footer';
import { FunctionComponent } from 'react';
import { AppContexProvider, IAppContext } from '../context/app.contex';



const Layout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<div className={styles.wrapper}>
			<Header className={styles.header}/>
			<Sidebar className={styles.sidebar}/>
				<div className={styles.body}>
					{children}
				</div>	
			<Footer className={styles.footer}/>	
		</div>
	);
};

// компонент высшего порядка который будет оборачивать нашу страницу в layout
export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
	return function withLayoutComponent(props: T):JSX.Element {
		return (
			<AppContexProvider menu={props.menu} firstCategory={props.firstCategory}>
				<Layout>
					<Component {...props} />
				</Layout>
			</AppContexProvider>
		);
	};
};