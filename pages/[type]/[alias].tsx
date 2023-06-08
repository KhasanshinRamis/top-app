import { withLayout } from '../../Layout/Layout';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { TopLevelCategory, TopPageModel } from '../../interfaces/page.interface';
import { ParsedUrlQuery } from 'querystring';
import { ProductModel } from '../../interfaces/product.interface';
import { firstLevelMenu } from '../../helpers/helpers';


//создали [type] динамические страницы
//т.е. описание курсов, отзывы и т.д
//[alice].tsx - динамически создаёт роут данных


//export default next понимает что эта точка входа в рендер странички
//создаём подорку страниц курса
function Course({ menu, page, products }: CourseProps): JSX.Element {
	return (
		<>
			{products && products.length}
		</>
	);
}

export default withLayout(Course);

//т.к некст какие пути нам необходимо резолвить 
//создаём пути
export const getStaticPaths: GetStaticPaths = async () => {
	//создадим некоторый массив путей 
	let paths: string[] = [];

	for(const m of firstLevelMenu){
		//получаем данные меню первого уровня
		const { data: menu } = await axios.post<MenuItem[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find', {
			firstCategory: m.id
		});
		//закидываем созданные пути в массив путей
		//flatMap - объединяет массив в один, не делает массив массивов
		paths = paths.concat(menu.flatMap(s => s.pages.map(p => `/${m.route}/${p.alias}`)));
	}


	//отображаем эти пути
	return {
		paths,
		fallback: true
	};
};

//получаем пропсы курса
//алиас пролучаем через { params }: GetStaticPropsContext<ParsedUrlQuery>
export const getStaticProps: GetStaticProps<CourseProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
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
		const { data: menu } = await axios.post<MenuItem[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find', {
			firstCategory: firstCategoryItem.id
		});

		if (menu.length == 0){
			return {
				notFound: true
			};
		}

		//получаем данные страницы через params.alias
		const { data: page } = await axios.get<TopPageModel>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/byAlias/' + params.alias);

		//получаем данные продукта
		const { data: products } = await axios.post<ProductModel[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/product/find', {
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

interface CourseProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}