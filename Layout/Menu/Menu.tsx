import { useContext } from 'react';
import { AppContext } from '../../context/app.contex';
import { FirstLevelMenuItem, PageItem } from '../../interfaces/menu.interface';
import CoursesIcon from './icons/courses.svg';
import ServicesIcon from './icons/services.svg';
import BooksIcon from './icons/books.svg';
import ProductsIcon from './icons/products.svg';
import { TopLevelCategory } from '../../interfaces/page.interface';
import styles from './Menu.module.css';
import cn from 'classnames';
import Link from 'next/link';


// массив объектов данных меню
const firstLevelMenu: FirstLevelMenuItem[] = [
	{ route: 'courses', name: 'Курсы', icon:  <CoursesIcon/>, id: TopLevelCategory.Courses},
	{ route: 'services', name: 'Сервисы', icon:  <ServicesIcon/>, id: TopLevelCategory.Services},
	{ route: 'books', name: 'Книги', icon:  <BooksIcon/>, id: TopLevelCategory.Books},
	{ route: 'products', name: 'Продукты', icon:  <ProductsIcon/>, id: TopLevelCategory.Products}
];

export const Menu = (): JSX.Element => {
	//берём значения у раннее созданного context`a
	const { menu, setMenu, firstCategory } = useContext(AppContext);
	
	//разбиваем меню на несколько функции 
	const buildFirstLevel = () => {
		return (
		<>
			{firstLevelMenu.map(m => (
				<div key={m.route}>
					<Link href={`/${m.route}`}>
						<div className={cn(styles.firstLevel, {
							//активная ссылка
							[styles.firstLevelActive]: m.id == firstCategory
						})}>
							{/* svg иконки */}
							{m.icon}
							{/* название вкладки меню */}
							<span>{m.name}</span>
						</div>
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
				{menu.map(m => (
					<div key={m._id.secondCategory}>
						<div className={styles.secondLevel}>
							{m._id.secondCategory}
						</div>
						<div className={cn(styles.secondLevelBlock, {
							[styles.secondLevelBlockOpened]: m.isOpened
						})}>
							{/* передаём информацию по поводу страницы */}
							{buildThirdLevel(m.pages, menuItem.route)}
						</div>
					</div>
				))}
			</div>
		);
	};

	
	const buildThirdLevel = (pages: PageItem[], route: string) => {
		return (
			pages.map(p => (
				<Link href={`/${route}/${p.alias}`}>
					<div className={cn(styles.thirdLevel, {
						[styles.thirdLevelActive]: false
					})}>
						{p.category}
					</div>
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