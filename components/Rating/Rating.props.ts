import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface RatingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	//редактируемый компонент?
	isEditable?: boolean;
	rating: number;
	setRating?: (rating: number) => void
}