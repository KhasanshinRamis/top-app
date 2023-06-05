import { useContext } from 'react';
import { AppContext } from '../../context/app.contex';



export const Menu = (): JSX.Element => {
	const { menu, setMenu, firstCategory } = useContext(AppContext);
	
	return (
		<div>
			<ul>
				{/* Вытаскиваем меню второй иерархии*/}
				{menu.map(m => (<li key={m._id.secondCategory}>{m._id.secondCategory}</li>))}
			</ul>	
		</div>
	);
};