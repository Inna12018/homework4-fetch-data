// Задание
// Получить список фильмов серии Звездные войны, и вывести на экран список персонажей для каждого из них.

// Технические требования:

// Отправить AJAX запрос по адресу https://ajax.test-danit.com/api/swapi/films и 
//получить список всех фильмов серии Звездные войны

// Для каждого фильма получить с сервера список персонажей, которые были показаны в данном фильме.
// Список персонажей можно получить из свойства characters.
// Как только с сервера будет получена информация о фильмах, сразу же вывести список всех фильмов на экран. 
// Необходимо указать номер эпизода, название фильма, а также короткое содержание (поля episodeId, name, openingCrawl).
// Как только с сервера будет получена информация о персонажах какого-либо фильма, 
//вывести эту информацию на экран под названием фильма.

// Необязательное задание продвинутой сложности
// Пока загружаются персонажи фильма, прокручивать под именем фильма анимацию загрузки. Анимацию можно использовать любую. Желательно найти вариант на чистом 
//CSS без использования JavaScript.


// Примечание
// Задание должно быть выполнено на "чистом" Javascript без использования библиотек типа jQuery или React.

// const API = "https://ajax.test-danit.com/api/swapi/films";

getFilm();

function getFilm() {
    return fetch('https://ajax.test-danit.com/api/swapi/films')
        .then(response => response.json()) // получаю дату // перевожу в формат json   
        .then(data => data.sort((a, b) => b.episodeId - a.episodeId))// делаем, чтоб эпизоды шли по порядку ( не)    
        .then(items => renderFilms(items));
       
}

function renderFilms(films) {

    films.forEach(film => {

        const filmElement = document.createElement('div');  // создаем контейнер для заголовков (номер эпизода, название фильма, содержание.)

        filmElement.insertAdjacentHTML('afterbegin', `
            <h2>Name: ${film.name}</h2>
            <p><strong>Episode:</strong> ${film.episodeId}</p>
            <p><strong>Description:</strong> ${film.openingCrawl}</p>
        `);



        const charactersList = document.createElement('ol');// формируем список персонажей

        const preloader = document.createElement('div'); //создаем контейнер для лоудера
        preloader.className = 'loader';

        Promise.all(film.characters.map(char => fetch(char)))
            .then(answers => Promise.all(answers.map(answer => answer.json())))
            .then(chars => chars.forEach(char => renderCharacters(char, charactersList, preloader)));

        charactersList.textContent = 'Characters: ';
        charactersList.style.fontWeight = '700';
        document.body.prepend(filmElement);
        filmElement.append(charactersList);
        filmElement.append(preloader);


    });
}

function renderCharacters(char, charactersList, preloader) {

    const charName = document.createElement('li');
    charName.textContent = char.name;
    charName.style.fontWeight = 'normal';
    charactersList.append(charName);
    preloader.remove();
}

