import { useContext } from 'react';
import { AppContext } from '../../context/app.contex';
import { FirstLevelMenuItem, PageItem } from '../../interfaces/menu.interface';
import styles from './Menu.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firstLevelMenu } from '../../helpers/helpers';



export const Menu = (): JSX.Element => {
	//берём значения у раннее созданного context`a
	const { menu, setMenu, firstCategory } = useContext(AppContext);
	//используем router для того чтобы скрыть 3 уровень меню и выделит активные ссылки
	const router = useRouter();
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
					<Link href={`/${m.route}`}>
						<span className={cn(styles.firstLevel, {
							//активная ссылка
							[styles.firstLevelActive]: m.id == firstCategory
						})}>
							{/* svg иконки */}
							{m.icon}
							{/* название вкладки меню */}
							<span>{m.name}</span>
						</span>
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
						<div className={cn(styles.secondLevelBlock, {
							[styles.secondLevelBlockOpened]: m.isOpened
						})}>
							{/* передаём информацию по поводу страницы */}
							{buildThirdLevel(m.pages, menuItem.route)}
						</div>
					</div>
					);
				})}
			</div>
		);
	};

	
	const buildThirdLevel = (pages: PageItem[], route: string) => {
		return (
			pages.map(p => (
				<Link key={p._id} href={`/${route}/${p.alias}`}>
					<span className={cn(styles.thirdLevel, {
						[styles.thirdLevelActive]: `/${route}/${p.alias}` == router.asPath
					})}>
						{p.category}
					</span>
				</Link>
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