import React from 'react';
import PropTypes from 'prop-types';

function LinksDisplay({ links }) {
  // Проверка, что links не только задан, но и является массивом с элементами
  if (!Array.isArray(links) || links.length === 0) {
    return null; // Не отображать компонент, если нет ссылок
  }

  return (
    <div>
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <a
            href={link.link} // URL ссылки
            className="text-blue hover:text-bluedeep cursor-pointer" // Классы для стилизации
            style={{ marginRight: index < links.length - 1 ? 10 : 0 }} // Добавляем margin справа, кроме последнего элемента
          >
            {link.title}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}

// ПропТайпс для валидации входных параметров
LinksDisplay.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default LinksDisplay;