import { withLayout } from '../Layout/Layout';
import { GetStaticProps } from 'next';
import axios from 'axios';
import { MenuItem } from '../interfaces/menu.interface';

//страница для сёрча

//export default next понимает что эта точка входа в рендер странички
function Search(): JSX.Element {

	return (
		<>
			Search
		</>
	);
}

export default withLayout(Search);

// Получаем пропсы через http запросы
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
	const firstCategory = 0;
	//получаем результат post запроса 
	const { data: menu } = await axios.post<MenuItem[]>(process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find', {
		firstCategory
	});
	return {
		props: {
			menu,
			// это данные меню, вышей иерархии
			firstCategory
		}
	};
};

//типизация Home
interface HomeProps extends Record<string, unknown>{
	menu: MenuItem[],
	firstCategory: number;
}