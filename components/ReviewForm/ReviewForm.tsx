import { ReviewFormProps } from './ReviewForm.props';
import styles from './ReviewForm.module.css';
import cn from 'classnames';
import { Button, Input, Rating, Textarea } from '../index';
import CloseIcon from './close.svg';
import { useForm, Controller } from 'react-hook-form';
import { IReviewForm, IReviewSentResponse } from './ReviewForm.interface';
import axios from 'axios';
import { API } from '../../helpers/api';
import { useState } from 'react';


export const ReviewForm = ({ productId, isOpened, className, ...props }: ReviewFormProps): JSX.Element => {

	// register - для регистрации формы
	// control - для регистрации управляемых компонентов
	// handleSubmit -- нажатие на клавишу 
	const { register, control, handleSubmit, formState: { errors }, reset, clearErrors } = useForm<IReviewForm>();

	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const onSubmit = async (formData: IReviewForm) => {

			const { data } = await axios.post<IReviewSentResponse>(API.review.createDemo, { ...formData, productId });
			if (data.message) {
				setIsSuccess(true);
				reset();
			}
	};
	
	return (
		// в onSubmit={handleSubmit()} вызывается после нажатии на submit
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className={cn(styles.reviewForm, className)}
				{...props}
			>
				{/* register('name') привязка неуправляемых компонентов к форме */}
				<Input 
					{...register('name', {required: {value: true, message: "Заполните имя"}})} 
					className={styles.name} 
					placeholder='Имя'
					error={errors.name}
					tabIndex={isOpened ? 0 : -1}
					aria-invalid={errors.name ? true : false}
				/>

				<Input 
					{...register('title', {required: {value: true, message: "Заполните заголовок"}})} 
					className={styles.title} 
					placeholder='Заголовок отзыва' 
					error={errors.title}
					aria-invalid={errors.title ? true : false}
				/>


				<div className={styles.rating}>
					<span>Оценка:</span>
					{/* Управляемый компонент */}
					<Controller
						control={control}
						// привязка к контроллеру
						name='rating'
						//что возвращаем
						//валидация
						rules={{required: {value: true, message: "Укажите рейтинг"}}}
						render={({ field }) => (
							<Rating
								isEditable 
								rating={field.value} 
								ref={field.ref} 
								setRating={field.onChange}
								error={errors.rating}
								tabIndex={isOpened ? 0 : -1}
							/>
						)}
					/>	
				</div>

				<Textarea 
					{...register('description', {required: {value: true, message: "Заполните описание"}})} 
					className={styles.description} 
					placeholder='Текст отзыва'
					error={errors.description} 
					tabIndex={isOpened ? 0 : -1}
					aria-label='Текст отзыва'
					aria-invalid={errors.description ? true : false}
				/>

				<div className={styles.submit}>
					<Button 
						appearance='primary' 
						className={styles.reviewFormButton}
						tabIndex={isOpened ? 0 : -1}
						onClick={() => clearErrors( )}
					>
						Отправить
					</Button>
					<span className={styles.info}>* Перед публикацией отзыв пройдет предварительную модерацию и проверку</span>
				</div>
			</div>

			{isSuccess && <div className={cn(styles.panel, styles.success)} role='alert'>

				<div className={styles.successTitle}>Ваш отзыв отправлен</div>
				<div>
					Спасиб, ваш отзыв будет опубликован после проверки!				
				</div>
				<button
					className={styles.close}
					onClick={() => (setIsSuccess(false))}
					aria-label='Закрыть оповещание'
				>
					<CloseIcon/>
				</button>
				

			</div>}

			
			{error && <div className={cn(styles.panel, styles.error)}  role='alert'>	

				Что-то пошло не так, попробуйте обновить страницу
				<button  
					className={styles.close} 
					onClick={() => (setError(undefined))}
					aria-label='Закрыть оповещание'
				>
					<CloseIcon/>
				</button>
				

			</div>}

		</form>
	);
};