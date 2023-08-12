import { RatingProps } from './Rating.props';
import styles from './Rating.module.css';
import cn from 'classnames';
import StarIcon from './star.svg';
import { useEffect, useState, KeyboardEvent, forwardRef, ForwardedRef, useRef } from 'react';


export const Rating = forwardRef(({ isEditable = false, rating, setRating, error, tabIndex, ...props}: RatingProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
	// создаём через useState пустой массив звёздочек-рейтингов
	const [ratingArray, setRatingArray] = useState<JSX.Element[]>(new Array(5).fill(<></>)); 
	
	const ratingArrayRef = useRef<(HTMLSpanElement | null)[]>([]);

	//при один раз взаимодействии с рейтингом вызывается useEffect
	useEffect(() => {
		constructRating(rating);
	}, [rating, tabIndex]);


	const computeFocus = (r: number, i: number) => {
		if (!isEditable) {
			return -1;
		}
		if (!rating && i == 0) {
			return tabIndex ?? 0;
		} 
		if ( r == i + 1) {
			return tabIndex ?? 0;
		}
		return -1;
	};

	const constructRating = (currentRating: number) => {
		const updatedArray = ratingArray.map((r: JSX.Element, i: number) =>{
			return (
				<span
					className={cn(styles.star, {
						[styles.filled]: i < currentRating,
						[styles.editable]: isEditable
					})}
					//переход через табиндекс
					tabIndex={computeFocus(rating, i)}
					//обработка нажатия через клавишу
					onKeyDown={handleKey}
					ref={r => ratingArrayRef.current?.push(r)}
					role={isEditable ? 'slider' : ''}
					aria-invalid={error ? true : false}
					aria-valuenow={rating}
					aria-valuemax={5}
					aria-valuemin={1}
					aria-label={isEditable ? 'Укажите рейтинг' : ('рейтинг' + rating)}
					// событие при наведении на рейтинг-звёздочки
					onMouseEnter={() => changeDisplay(i + 1)}
					//событие после наведения на рейтинг-звёздочки
					onMouseLeave={() => changeDisplay(rating)}
					//событие при клике на рейтинг-звёздочки
					onClick={() => onClickRating(i + 1)}
				>	
					<StarIcon/>
				</span>
			);
		});
		setRatingArray(updatedArray);
	};

	const handleKey = (e: KeyboardEvent) => {
		if (!isEditable || !setRating) {
			return;
		}
		if (e.code == 'ArrowRight' || e.code == 'ArrowUp') {
			if (!rating) {
				setRating(1);
			} else {
				e.preventDefault();
				setRating(rating < 5 ? rating + 1 : 5);
			}
			ratingArrayRef.current[rating]?.focus();
		}
		if (e.code == 'ArrowLeft' || e.code == 'ArrowDown') {
			e.preventDefault();
			setRating(rating > 1 ? rating - 1 : 1);
		}
	};
	
	const onClickRating = (i: number) => {
		if(!isEditable || !setRating){
			return;
		}
		setRating(i);
	};

	const changeDisplay = (i: number) => {
		if(!isEditable){
			return;
		}
		constructRating(i);
	};

	return (
		<div {...props} ref={ref} className={cn(styles.ratingWrapper, {
			[styles.error]: error
		})}>
			{ratingArray.map((r, i) => (<span key={i}>{r}</span>))}
			{error && <span role='alert' className={styles.errorMessage}>{error.message}</span>}
		</div>);
});