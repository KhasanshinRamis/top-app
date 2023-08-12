import { TopPageComponentProps } from './TopPageComponent.props';
import styles from './TopPageComponent.module.css';
import { HhData, Htag, Tag, Advantages, Sort, Product } from '../../components';
import { TopLevelCategory } from '../../interfaces/page.interface';
import { SortEnum } from '../../components/Sort/Sort.props';
import { useReducer,useEffect } from 'react';
import { sortReducer } from './sort.reducer';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';


export const TopPageComponent = ({ page, products, firstCategory }: TopPageComponentProps): JSX.Element => {

	const [{products: sortedProducts, sort}, dispathSort] = useReducer(sortReducer, {products, sort: SortEnum.Rating});
	
	//уменьшение движения анимации
	const shouldReducerMotion = useReducedMotion();

	const setSort = (sort: SortEnum) => {
		dispathSort({ type: sort});
	};

	useEffect(() => {
		dispathSort({ type: 'reset', initialState: products });
	}, [products]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>
				<Htag tag='h1'>{page.title}</Htag>
				{products && <Tag color='grey' size='medium' aria-label={products.length + 'элементов'}>{products.length}</Tag>}
				<Sort sort={sort} setSort={setSort}/>
			</div>

			<div role='list' className={styles.sortProducts}>
				{/* продукты запихнули в state и когда происходит setSort меняем state через dispathSort*/}
				{/* при измение layout автоматически будет анимироваться Product */}
				{sortedProducts && sortedProducts.map(p => (<Product role='listitem' layout={shouldReducerMotion ? false : true} key={p._id} product={p}/>))}
			</div>

			{firstCategory == TopLevelCategory.Courses && page.hh &&
				<section>
					<div className={styles.hhTitle}>
						<Htag tag='h2'>Вакансии - {page.category}</Htag>
						<Tag color='red' size='medium'><Link href="https://hh.ru">hh.ru</Link></Tag>
					</div>
.
					<HhData 
						{...page.hh}
					/>
				</section>
			}

			{page.advantages && page.advantages.length > 0 && page.advantages[0].title && <>
					<Htag tag='h2'>Преимущество</Htag>
					<Advantages 
						advantages={page.advantages}
					/>
				</>
				
			}	

			{page.seoText &&  <div className={styles.seo} dangerouslySetInnerHTML={{__html: page.seoText}}/>}

			<section>
				<Htag tag='h2'>Получаемые навыки</Htag>
				{page.tags.map(t => <Tag key={t} color='primary'>{t}</Tag>)}
			</section>

		</div>
	);
};

