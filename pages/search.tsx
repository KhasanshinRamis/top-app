import { GetStaticProps } from 'next';
import { withLayout } from '../Layout/Layout';
import axios from 'axios';
import { MenuItem } from '../interfaces/menu.interface';
import { API } from '../helpers/api';

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
	//какая категория по дефолту будет сгенерирована
	const firstCategory = 0;
	//получаем результат post запроса 
	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find , {
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