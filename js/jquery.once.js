
/**
 * jQuery Once Plugin v1.2
 * http://plugins.jquery.com/project/once
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  var cache = {}, uuid = 0;

  /**
   * Filters elements by whether they have not yet been processed.
   *
   * @param id
   *   (Optional) If this is a string, then it will be used as the CSS class
   *   name that is applied to the elements for determining whether it has
   *   already been processed. The elements will get a class in the form of
   *   "id-processed".
   *
   *   If the id parameter is a function, it will be passed off to the fn
   *   parameter and the id will become a unique identifier, represented as a
   *   number.
   *
   *   When the id is neither a string or a function, it becomes a unique
   *   identifier, depicted as a number. The element's class will then be
   *   represented in the form of "jquery-once-#-processed".
   *
   *   Take note that the id must be valid for usage as an element's class name.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.once = function (id, fn) {
    if (typeof id != 'string') {
      // Generate a numeric ID if the id passed can't be used as a CSS class.
      if (!(id in cache)) {
        cache[id] = ++uuid;
      }
      // When the fn parameter is not passed, we interpret it from the id.
      if (!fn) {
        fn = id;
      }
      id = 'jquery-once-' + cache[id];
    }
    // Remove elements from the set that have already been processed.
    var name = id + '-processed';
    var elements = this.not('.' + name).addClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };

  /**
   * Filters elements that have been processed once already.
   *
   * @param id
   *   A required string representing the name of the class which should be used
   *   when filtering the elements. This only filters elements that have already
   *   been processed by the once function. The id should be the same id that
   *   was originally passed to the once() function.
   * @param fn
   *   (Optional) If given, this function will be called for each element that
   *   has not yet been processed. The function's return value follows the same
   *   logic as $.each(). Returning true will continue to the next matched
   *   element in the set, while returning false will entirely break the
   *   iteration.
   */
  $.fn.removeOnce = function (id, fn) {
    var name = id + '-processed';
    var elements = this.filter('.' + name).removeClass(name);

    return $.isFunction(fn) ? elements.each(fn) : elements;
  };
})(jQuery);

// Добавьте в существующий JavaScript

// Предотвращение случайного зума на мобильных устройствах при двойном тапе
document.addEventListener('dblclick', function(e) {
  e.preventDefault();
}, { passive: false });

// Улучшение отзывчивости кнопок на мобильных устройствах
document.addEventListener('touchstart', function() {}, {passive: true});

// Оптимизация прокрутки на iOS
document.addEventListener('touchmove', function(e) {
  if(e.target.closest('.main-game-table-wrapper, .vote-wrapper')) {
    e.stopPropagation();
  }
}, {passive: true});
let timerInterval;
let remainingTime;
let isPaused = false;

function startTimer(duration) {
  clearInterval(timerInterval);
  remainingTime = duration;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime--;
      updateTimerDisplay();
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById('timer-display').classList.add('expired');
      } else if (remainingTime < 10) {
        document.getElementById('timer-display').classList.add('warning');
      }
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  isPaused = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  remainingTime = 0;
  updateTimerDisplay();
  document.getElementById('timer-display').classList.remove('warning', 'expired');
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  const display = document.getElementById('timer-display');
  display.textContent = `${minutes}:${seconds}`;
  display.classList.remove('warning', 'expired');
}


// Функция для обновления итоговой суммы
function updateTotal(rowIndex) {
  const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
  const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
  const total = points + addPoints;
// Обновляем ячейку с итогом
  document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
}
// Добавляем обработчики событий для всех полей ввода
for(let i = 0; i < 10; i++) {
// Для основных баллов
  document.getElementById(`points_${i}`).addEventListener('input', function() {
    updateTotal(i);
  });
// Для дополнительных баллов
  document.getElementById(`add_points_${i}`).addEventListener('input', function() {
    updateTotal(i);
  });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker зарегистрирован');
        })
        .catch(error => {
          console.log('Ошибка регистрации ServiceWorker:', error);
        });
  });
}
