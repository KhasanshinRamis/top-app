import { Htag } from '../components';
import { withLayout } from '../Layout/Layout';




export function Error404(): JSX.Element {
	return (
		<div>
			<Htag tag='h1'>Ошибка 404</Htag>
		</div>
	);
}
//export default next понимает что эта точка входа в рендер странички
//мы оборачиваем её в обёртку Layout
export default withLayout(Error404);
