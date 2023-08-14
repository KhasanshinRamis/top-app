import { withLayout } from '../../Layout/Layout';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { TopLevelCategory, TopPageModel } from '../../interfaces/page.interface';
import { ParsedUrlQuery } from 'querystring';
import { ProductModel } from '../../interfaces/product.interface';
import { firstLevelMenu } from '../../helpers/helpers';
import { TopPageComponent } from '../../page-components';
import { API } from '../../helpers/api';
import Head from 'next/head';
import { Error404 } from '../404';


//создали [type] динамические страницы
//т.е. описание курсов, отзывы и т.д
//[alice].tsx - динамически создаёт роут данных


//export default next понимает что эта точка входа в рендер странички
//создаём подорку страниц курса
function TopPage({ firstCategory, page, products }: TopPageProps): JSX.Element {

	if (!page || !products) {
		return <Error404/>;
	}

	return (
		<>
			<Head>
				<title>{page.metaTitle}</title>
				<meta name='description' content={page.metaDescription}/>
				<meta property='og:title' content={page.metaTitle}/>
				<meta property='og:description' content={page.metaDescription}/>
				<meta property='og:type' content='article'/>
				
			</Head>
			<TopPageComponent
				firstCategory={firstCategory}
				page={page}
				products={products}
			/>
		</>
	);
}

export default withLayout(TopPage);

//т.к некст какие пути нам необходимо резолвить 
//создаём пути
export const getStaticPaths: GetStaticPaths = async () => {
	//создадим некоторый массив путей 
	let paths: string[] = [];

	for(const m of firstLevelMenu){
		//получаем данные меню первого уровня
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: m.id
		});
		//закидываем созданные пути в массив путей
		//flatMap - объединяет массив в один, не делает массив массивов
		paths = paths.concat(menu.flatMap(s => s.pages.map(p => `/${m.route}/${p.alias}`)));
	}


	//отображаем эти пути
	return {
		paths,
		// если после эта билда захотим создать новый путь страницы, которой не было в бэке, то fallback: true -
		//автоматически создаст новые пути страниц
		// возможность создавать неограниченное количество страниц
		fallback: false
	};
};

//получаем пропсы курса
//алиас пролучаем через { params }: GetStaticPropsContext<ParsedUrlQuery>
export const getStaticProps: GetStaticProps<TopPageProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	//если нет params, то возвращаем ошибку 404 
	if (!params) {
		return {
			notFound: true
		};
	}

	//берём пропсы у первого уровня 
	const firstCategoryItem = firstLevelMenu.find(m => m.route == params.type);

	//если нет firstCategoryItem, то возвращаем ошибку 404 
	if (!firstCategoryItem) {
		return {
			notFound: true
		};
	}

	try {
		//получаем данные меню
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: firstCategoryItem.id
		});

		if (menu.length == 0){
			return {
				notFound: true
			};
		}

		//получаем данные страницы через params.alias
		const { data: page } = await axios.get<TopPageModel>(API.topPage.byAlias + params.alias);

		//получаем данные продукта
		const { data: products } = await axios.post<ProductModel[]>(API.product.find, {
			category: page.category,
			limit: 10
		});

		return {
			props: {
				menu,
				firstCategory: firstCategoryItem.id,
				page,
				products
			}
		};
	}catch {
		return {
			notFound: true
		};
	}
};

interface TopPageProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}