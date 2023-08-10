import { useContext } from 'react';
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
			maxHeight: 38
		},
		hidden: {
			opacity: 0,
			maxHeight: 0
		}
	};

	//обработчик который позволяет открыть меню второго уовня
	const openSecondLevel = (secondCategory: string) => {
		//должны пройтись по меню и проставить open тому на кого мы кликнули и обновить state муню через setMenu
		setMenu && setMenu(menu.map(m => {
			if (m._id.secondCategory == secondCategory){
				m.isOpened = !m.isOpened;
			}
			return m;
		}));
	};

	//разбиваем меню на несколько функции 
	const buildFirstLevel = () => {
		return (
		<>
			{firstLevelMenu.map(m => (
				<div key={m.route}>
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
				</div>
			))}
		</>
		);
	};

	const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
		return (
			<div className={styles.secondBlock}>
				{menu.map(m => {
					//если у нашего меню у массива путей страниц содержит путь открытой страницы,
					//то ставим флажок в isOpened = true
					if (m.pages.map(p => p.alias).includes(router.asPath.split('/')[2])) {
						m.isOpened = true;
					}
					return (
					<div key={m._id.secondCategory}>
						<div className={styles.secondLevel} onClick={() => openSecondLevel(m._id.secondCategory)}>
							{m._id.secondCategory}
						</div>
						<motion.div 
							className={cn(styles.secondLevelBlock)}
							//анимация движения
							layout
							variants={variants}
							initial={m.isOpened ? 'visible' : 'hidden'}
							animate={m.isOpened ? 'visible' : 'hidden'}
							>
								{/* передаём информацию по поводу страницы */}
								{buildThirdLevel(m.pages, menuItem.route)}
						</motion.div>
					</div>
					);
				})}
			</div>
		);
	};

	
	const buildThirdLevel = (pages: PageItem[], route: string) => {
		return (
			pages.map(p => (
				<motion.div
					variants={variantsChildren}
					key={p._id}
				>
					<Link 
						href={`/${route}/${p.alias}`}
						className={cn(styles.thirdLevel, {
							//если '/${route}/${p.alias}' равен как путь 
							[styles.thirdLevelActive]: `/${route}/${p.alias}` == router.asPath
						})}
					>
						<span >
							{p.category}
						</span>
					</Link>
				</motion.div>
			))
		);
	};

	return (
		<div className={styles.menu}>
			<ul>
				{buildFirstLevel()}
			</ul>	
		</div>
	);
};