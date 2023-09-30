window.addEventListener('DOMContentLoaded', () => {
  // Nav Header
  const navHeader = () => {
    const header = document.querySelector('#header');
    const intro = document.querySelector('.intro');
    let introH = intro.offsetHeight;
    let scrollPos = window.pageYOffset || document.documentElement.scrollTop;

    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.burger__wrapper');

    // Fixed Header
    window.addEventListener('scroll', () => {
      introH = intro.offsetHeight;
      scrollPos = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollPos > introH) {
        header.classList.add('fixed', 'animated', 'fadeInDown', 'show');
      } else {
        header.classList.remove('fixed', 'fadeInDown', 'show');
      }

      if (scrollPos < introH && nav.classList.contains('show')) {
        header.classList.add('show');
      }
    });

    // Navigation
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();

      if (scrollPos < introH) {
        header.classList.toggle('show');
      }

      nav.classList.toggle('show');
      navToggle.classList.toggle('burger--close');
    });
  };
  navHeader();

  // Smooth Scroll
  const scrolling = (upSelector) => {
    // Функция PageUp
    const upElem = document.querySelector(upSelector);

    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop > 1650) {
        upElem.classList.add('animated', 'fadeIn');
        upElem.classList.remove('fadeOut');
      } else {
        upElem.classList.add('fadeOut');
        upElem.classList.remove('fadeIn');
      }
    });

    // Scrolling with Request Animation Frame
    const links = document.querySelectorAll('[href^="#"]');
    const speed = 0.2;

    links.forEach((link) => {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        const widthTop = document.documentElement.scrollTop;
        const { hash } = this;
        const toBlock = document.querySelector(hash).getBoundingClientRect().top;
        let start = null;

        requestAnimationFrame(step);

        function step(time) {
          if (start === null) {
            start = time;
          }

          const progress = time - start;
          const r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

          document.documentElement.scrollTo(0, r);

          if (r !== widthTop + toBlock) {
            requestAnimationFrame(step);
          } else {
            location.hash = hash;
          }
        }
      });
    });
  };
  scrolling('.pageup');

  // Filter
  const filter = () => {
    const menu = document.querySelector('.portfolio__nav');
    const items = menu.querySelectorAll('div');
    const btnAll = menu.querySelector('.all');
    const btnExteriors = menu.querySelector('.exteriors');
    const btnInteriors = menu.querySelector('.interiors');
    const btnPublicInteriors = menu.querySelector('.public-interiors');

    const wrapper = document.querySelector('.portfolio__list');
    const markAll = wrapper.querySelectorAll('.all');
    const markExteriors = wrapper.querySelectorAll('.exteriors');
    const markInteriors = wrapper.querySelectorAll('.interiors');
    const markPublicInteriors = wrapper.querySelectorAll('.public-interiors');

    const typeFilter = (markType) => {
      markAll.forEach((mark) => {
        // Скрыть все элементы
        mark.style.display = 'none';
        // Удаляем классы анимации
        mark.classList.remove('animated', 'fadeIn');
      });

      if (markType) {
        markType.forEach((mark) => {
          mark.style.display = 'block';
          mark.classList.add('animated', 'fadeIn');
        });
      }
    };

    btnAll.addEventListener('click', () => {
      typeFilter(markAll);
    });

    btnExteriors.addEventListener('click', () => {
      typeFilter(markExteriors);
    });

    btnInteriors.addEventListener('click', () => {
      typeFilter(markInteriors);
    });

    btnPublicInteriors.addEventListener('click', () => {
      typeFilter(markPublicInteriors);
    });

    menu.addEventListener('click', (e) => {
      const { target } = e;

      if (target && target.tagName === 'DIV') {
        items.forEach((btn) => btn.classList.remove('is-active'));
        target.classList.add('is-active');
      }
    });
  };
  filter();

  // Forms
  const forms = () => {
    const form = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input');
    const textFields = document.querySelectorAll('textarea');
    const phoneFields = document.querySelectorAll('input[type="tel"]');

    // В полях номера телефона вводить только цифры
    phoneFields.forEach((input) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/, '');
      });
    });

    // Ответы для пользователя
    const answers = {
      loadingMessage: 'Загрузка...',
      successMessage: 'Спасибо! Мы ответим Вам в течении 10 минут',
      failMessage: 'Извините! Что-то пошло не так...',
      loadingImg: './img/loading.gif',
      successImg: './img/success.png',
    };

    // Функция отправки запроса
    const postData = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });
      return await response.text();
    };

    // Очистка полей формы после отправки
    const clearFields = () => {
      inputs.forEach((input) => {
        input.value = '';
      });

      textFields.forEach((field) => {
        field.value = '';
      });
    };

    // Обрабочик на отправку формы Submit
    form.forEach((item) => {
      item.addEventListener('submit', (event) => {
        // Отмена стандартного поведения браузера
        event.preventDefault();

        // Блок ответа для пользователя
        const answerPopup = document.createElement('div');
        answerPopup.classList.add('popup__answer', 'animated', 'flipInX');
        document.body.append(answerPopup);

        const answerImg = document.createElement('img');
        answerImg.setAttribute('src', answers.loadingImg);
        answerPopup.append(answerImg);

        const answerText = document.createElement('p');
        answerText.textContent = answers.loadingMessage;
        answerPopup.append(answerText);

        const divFail = document.createElement('div');
        divFail.classList.add('img__failed');

        // Собрание всех данных которые ввел пользователь
        const formData = new FormData(item);

        // Осуществляем post запрос
        postData('./server.php', formData)
        // Успешное выполнение
          .then((response) => {
            // console.log(response);
            answerImg.setAttribute('src', answers.successImg);
            answerText.textContent = answers.successMessage;
          })
        // Обработка ошибки
          .catch(() => {
            answerImg.remove();
            answerPopup.prepend(divFail);
            answerText.textContent = answers.failMessage;
          })
          .finally(() => {
            clearFields();
            setTimeout(() => {
              answerPopup.classList.remove('flipInX');
              answerPopup.classList.add('flipOutX');
              // answerPopup.remove();
            }, 3000);
          });
      });
    });
  };
  forms();

  // Quotes Slider
  const slider = (slides, prev, next) => {
    // Текущий слайд который показывается пользователю
    let slideIndex = 1;
    let paused = false;

    // Слайды
    const items = document.querySelectorAll(slides);

    // Функция показа слайда
    function showSlides(n) {
      // Если n больше чем количество слайдов
      if (n > items.length) {
        slideIndex = 1;
      }
      // Если n меньше чем количество слайдов
      if (n < 1) {
        slideIndex = items.length;
      }

      items.forEach((item) => {
        item.classList.add('animated');
        // Скрываем все слайды
        item.style.display = 'none';
      });

      // Показать нужный слайд
      items[slideIndex - 1].style.display = 'flex';
    }

    showSlides(slideIndex);

    function plusSlide(n) {
      showSlides(slideIndex += n);
    }

    // Если селекторы для кнопок не были переданы
    try {
      const prevBtn = document.querySelector(prev);
      const nextBtn = document.querySelector(next);

      prevBtn.addEventListener('click', () => {
        plusSlide(-1);
        items[slideIndex - 1].classList.remove('zoomOut');
        items[slideIndex - 1].classList.add('zoomIn');
      });

      nextBtn.addEventListener('click', () => {
        plusSlide(1);
        items[slideIndex - 1].classList.remove('zoomIn');
        items[slideIndex - 1].classList.add('zoomOut');
      });
    } catch (e) {
    }

    // При наведении на слайдер останавливаем анимацию
    function activateAnimation() {
      // Автоматическая работа слайдера
      paused = setInterval(() => {
        plusSlide(1);
        items[slideIndex - 1].classList.remove('zoomOut');
        items[slideIndex - 1].classList.add('zoomIn');
      }, 4000);
    }

    activateAnimation();

    items[0].parentNode.addEventListener('mouseenter', () => {
      clearInterval(paused);
    });

    items[0].parentNode.addEventListener('mouseleave', () => {
      activateAnimation();
    });
  };
  slider('.quote-item-slider');

  // Glide Carousel
  const config = {
    type: 'carousel',
    startAt: 0,
    perView: 5,
    // autoplay: 4000,
    breakpoints: {
      1024: {
        perView: 4,
      },
      768: {
        perView: 3,
      },
      600: {
        perView: 2,
      },
      420: {
        perView: 1,
      },

    },
  };
  new Glide('.glide', config).mount();
});
