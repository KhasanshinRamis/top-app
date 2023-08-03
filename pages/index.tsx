import { useState } from 'react';
import { Button, Htag, Ptag, Tag, Rating, Input, Textarea } from '../components';
import { withLayout } from '../Layout/Layout';
import { GetStaticProps } from 'next';
import axios from 'axios';
import { MenuItem } from '../interfaces/menu.interface';
import { API } from '../helpers/api';



function Home({menu}: HomeProps): JSX.Element {
	const [rating, setRating] = useState<number>(4);

	return (
		<>
			<Htag tag='h1'>Заголовок h1</Htag>
			<Button appearance='primary' arrow='right'>Кнопка</Button>
			<Button appearance='ghost' arrow='down'>Кнопка</Button>
			<Ptag size='large'>Выше указаны программы Adobe InDesign, Adobe Illustrator, Corel Draw и ими можно успешно пользоваться дома или в дороге. Современные ноутбуки хорошо справляются с нагрузкой, так зачем загонять специалиста в душный офис. В этой профессии важным считается вдохновение, поэтому дизайнеры ищут его в разных местах.</Ptag>
			<Ptag>Студенты освоят не только hard skills, необходимые для работы веб-дизайнером, но и soft skills — навыки, которые позволят эффективно взаимодействовать в команде с менеджерами, разработчиками и маркетологами. Выпускники факультета могут успешно конкурировать с веб-дизайнерами уровня middle</Ptag>
			<Ptag size='small'>Напишу сразу в двух курсах, так как проходил оба. Java будет многим непросвещённым сложновата в изучении, но здесь перевес из-за лидирующего положения языка как самого популярного в программировании. Выбор мой пал на эту профессию еще и потому, что Java-разработчики получают самую большую зарплату. Хотя Python начинает догонять Java по многим моментам, но вот в крупном екоме разработке Джава все-таки остается главенствующей сейчас. Скажу так – полнота программы и интенсивность присуща обоим курсам GeekBrains. Хочу отметить, что с первого дня занятий вы приступаете к практике и получаете опыт коммерческой разработки уже в свое резюме. Скажу вам как прошедший это – реально помогло в трудоустройстве!</Ptag>
			<Tag size='small'>Ghost</Tag>
			<Tag size='medium' color='red'>Red</Tag>
			<Tag size='small' color='green'>Green</Tag>
			<Tag color='primary'>Primary</Tag>
			<Rating rating={rating} isEditable setRating={setRating}/>
			<Input placeholder='test'/>
			<Textarea placeholder='test'/>
		</>
	);
}
//export default next понимает что эта точка входа в рендер странички
//мы оборачиваем её в обёртку Layout
export default withLayout(Home);

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