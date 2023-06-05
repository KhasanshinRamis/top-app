import { withLayout } from '../../Layout/Layout';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { TopPageModel } from '../../interfaces/page.interface';
import { ParsedUrlQuery } from 'querystring';
import { ProductModel } from '../../interfaces/product.interface';


//создали папку courses, в которой будут даннные нашей страницы 
//т.е. описание курсов, отзывы и т.д
//[alice].tsx - динамически создаёт роут данных


const firstCategory = 0;

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
	//получаем данные меню
	const { data: menu } = await axios.post<MenuItem[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find', {
		firstCategory
	});
	//отображаем эти пути
	return {
		//flatMap - объединяет массив в один, не делает массив массивов
		paths: menu.flatMap(m => m.pages.map(p => '/courses/' + p.alias)),
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

	//получаем данные меню
	const { data: menu } = await axios.post<MenuItem[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find', {
		firstCategory
	});

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
			firstCategory,
			page,
			products
		}
	};
};

interface CourseProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
	page: TopPageModel;
	products: ProductModel[];
}