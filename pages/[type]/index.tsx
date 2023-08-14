import { withLayout } from '../../Layout/Layout';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { firstLevelMenu } from '../../helpers/helpers';
import { ParsedUrlQuery } from 'querystring';
import { API } from '../../helpers/api';

//индексная страница при роуте

//export default next понимает что эта точка входа в рендер странички
function Type({ firstCategory }: TypeProps): JSX.Element {

	return (
		<>
			Type: {firstCategory}	
		</>
	);
}

export default withLayout(Type);

//т.к некст какие пути нам необходимо резолвить 
//создаём пути
export const getStaticPaths: GetStaticPaths = async () => {
	//отображаем эти пути
	return {
		paths: firstLevelMenu.map(m => '/' + m.route),
		fallback: false
	};
};

// Получаем пропсы через http запросы
export const getStaticProps: GetStaticProps<TypeProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	//получаем результат post запроса 
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

	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory: firstCategoryItem.id
	});
	return {
		props: {
			menu,
			// это данные меню, вышей иерархии
			firstCategory: firstCategoryItem.id
		}
	};
};

//типизация TypeProps
interface TypeProps extends Record<string, unknown> {
	menu: MenuItem[],
	firstCategory: number;
}