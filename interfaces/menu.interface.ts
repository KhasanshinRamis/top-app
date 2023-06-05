//создаём интерфейс для меню 
//данные страницы
export interface PageItem {
	alias: string;
	title: string;
	_id: string;
	category: string;
}

//корневой элемент из id и данных страницы
//будем получать несколько MenuItem
export interface MenuItem {
  _id: {
	secondCategory: string;
  };
  pages: PageItem[];
}