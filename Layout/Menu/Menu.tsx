import { useContext, KeyboardEvent, useState } from 'react';
import { AppContext } from '../../context/app.contex';
import { FirstLevelMenuItem, PageItem } from '../../interfaces/menu.interface';
import styles from './Menu.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firstLevelMenu } from '../../helpers/helpers';
import { motion } from 'framer-motion';



export const Menu = (): JSX.Element => {
	//берём значения у раннее созданного context`a
	const { menu, setMenu, firstCategory } = useContext(AppContext);
	//используем router для того чтобы скрыть 3 уровень меню и выделит активные ссылки

	const [announce, setAnnounce] = useState<'closed' | 'opened' | undefined>();
	const router = useRouter();

	//варианты анимации меню
	const variants = {
		visible: {
			marginBottom: 5,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.01
			}
		},
		hidden: { 
			marginBottom: 0
		}
	};

	const variantsChildren = {
		visible: {
			opacity: 1,
			minHeight: 29,
			maxHeight: 57
		},
		hidden: {
			opacity: 0,
			minHeight: 0,
			maxHeight: 0
		}
	};

	//обработчик который позволяет открыть меню второго уовня
	const openSecondLevel = (secondCategory: string) => {
		//должны пройтись по меню и проставить open тому на кого мы кликнули и обновить state муню через setMenu
		setMenu && setMenu(menu.map(m => {
			if (m._id.secondCategory == secondCategory){
				setAnnounce(m.isOpened ? 'closed' : 'opened');
				m.isOpened = !m.isOpened;
			}
			return m;
		}));
	};
	//открытие ссылок через таб индекс клавиш
	const openSecondLevelKey = (key: KeyboardEvent, secondCategory: string) => {
		if (key.code == 'Space' || key.code == 'Enter'){
			key.preventDefault();
			openSecondLevel(secondCategory);
		}
	};

	//разбиваем меню на несколько функции 
	const buildFirstLevel = () => {
		return (
			<ul className={styles.firstLevelList}>
				{firstLevelMenu.map(m => (
					<li key={m.route} aria-expanded={m.id == firstCategory}>
						<Link 
							href={`/${m.route}`} 
							className={cn(styles.firstLevel, {
								//активная ссылка
								[styles.firstLevelActive]: m.id == firstCategory
							})}>					
								{/* svg иконки */}
								{m.icon}
								{/* название вкладки меню */}
								<span>{m.name}</span>
						</Link>
						{/* следующиц уровень меню */}
						{m.id == firstCategory && buildSecondLevel(m)}
					</li>
				))}
			</ul>
		);
	};

	const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
		return (
			<ul className={styles.secondBlock}>
				{menu.map(m => {
					//если у нашего меню у массива путей страниц содержит путь открытой страницы,
					//то ставим флажок в isOpened = true
					if (m.pages.map(p => p.alias).includes(router.asPath.split('/')[2])) {
						m.isOpened = true;
					}
					return (
						<li key={m._id.secondCategory}>
							<button 
								tabIndex={0} 
								onKeyDown={(key: KeyboardEvent) => openSecondLevelKey(key, m._id.secondCategory)}
								className={styles.secondLevel}
								onClick={() => openSecondLevel(m._id.secondCategory)}
								aria-expanded={m.isOpened}
							>
								{m._id.secondCategory}
							</button>
							<motion.ul 
								className={cn(styles.secondLevelBlock)}
								//анимация движения
								layout
								variants={variants}
								initial={m.isOpened ? 'visible' : 'hidden'}
								animate={m.isOpened ? 'visible' : 'hidden'}
								>
									{/* передаём информацию по поводу страницы */}
									{buildThirdLevel(m.pages, menuItem.route, m.isOpened ?? false)}
							</motion.ul>
						</li>
					);
				})}
			</ul>
		);
	};

	
	const buildThirdLevel = (pages: PageItem[], route: string, isOpened: boolean) => {
		return (
			pages.map(p => (
				<motion.li
					variants={variantsChildren}
					key={p._id}
				>
					<Link 
						href={`/${route}/${p.alias}`}
						className={cn(styles.thirdLevel, {
							//если '/${route}/${p.alias}' равен как путь 
							[styles.thirdLevelActive]: `/${route}/${p.alias}` == router.asPath
						})}
						tabIndex={isOpened ? 0 : -1}
						aria-current={`/${route}/${p.alias}` == router.asPath ? 'page' : false}
					>
						<span >
							{p.category}
						</span>
					</Link>
				</motion.li>
			))
		);
	};

	return (
		<nav 
			className={styles.menu}
			role='navigation'
		>
			{announce && <span role='log' className='visualyHidden'>{announce == 'opened' ? 'развёрнуто' : 'свёрнуто'}</span>}
			{buildFirstLevel()}
		</nav>
	);
};