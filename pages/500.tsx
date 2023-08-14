import { Htag } from '../components';
import { withLayout } from '../Layout/Layout';




function Error500(): JSX.Element {
	return (
		<>
			<Htag tag='h1'>Ошибка 500</Htag>
		</>
	);
}
//export default next понимает что эта точка входа в рендер странички
//мы оборачиваем её в обёртку Layout
export default withLayout(Error500);
