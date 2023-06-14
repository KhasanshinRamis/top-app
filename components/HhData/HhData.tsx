import { HhDataProps } from './HhData.props';
import styles from './HhData.module.css';
import { Card } from '../Card/Card';
import RateIcon from './Rate.svg';

export const HhData = ({ count, juniorSalary, middleSalary, seniorSalary }:HhDataProps): JSX.Element => {
	return (
			<div className={styles.hh}>
				<Card className={styles.count}>
					<div className={styles.title}>Всего вакансии</div>
					<div className={styles.countValue}>{count}</div>
				</Card>

				<Card className={styles.salary}>

					<div>
						<div className={styles.title}>Начальный</div>
						<div className={styles.salaryValue}>{juniorSalary} &#x20bd;</div>
						<div className={styles.rate}>
							<RateIcon className={styles.filled}/>
							<RateIcon/>
							<RateIcon/>
						</div>
					</div>
				
					<div>
						<div className={styles.title}>Средний</div>
						<div className={styles.salaryValue}>{middleSalary} &#x20bd;</div>
						<div className={styles.rate}>
							<RateIcon className={styles.filled}/>
							<RateIcon className={styles.filled}/>
							<RateIcon/>
						</div>
					</div>
			
					<div>
						<div className={styles.title}>Профессионал</div>
						<div className={styles.salaryValue}>{seniorSalary} &#x20bd;</div>
						<div className={styles.rate}>
							<RateIcon className={styles.filled}/>
							<RateIcon className={styles.filled}/>
							<RateIcon className={styles.filled}/>
						</div>
					</div>

				</Card>
			</div>
	);
};