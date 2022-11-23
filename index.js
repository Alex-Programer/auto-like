const FIRST_WAIT_TIMEOUT = 60 * 30;
const CACHE_KEY = "auto-like-timeout";

let cacheTimeout = localStorage.getItem(CACHE_KEY);
let timeout = cacheTimeout || FIRST_WAIT_TIMEOUT;

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));

const getButtons = () => {
  return Array.from(document.querySelectorAll('[aria-live="polite"')).filter(
    (item) => {
      return Boolean(
        (item.textContent.indexOf("喜欢") !== -1 &&
          item.textContent.indexOf("取消喜欢") === -1) ||
          (item.textContent.indexOf("赞同") !== -1 &&
            item.textContent.indexOf("已赞同") === -1)
      );
    }
  );
};

const nextPage = async () => {
  const nextPage = document.querySelector(
    "Button.PaginationButton.PaginationButton-next.Button--plain"
  );

  if (nextPage) {
    nextPage.click();
    await sleep(2);
    await like();
  } else {
    alert("全部赞同、点赞完成");
  }
};

const like = async () => {
  const buttons = getButtons();

  if (buttons.length) {
    let item;

    while ((item = buttons.shift())) {
      item.scrollIntoView({ behavior: "smooth" });
      item.click();
      await sleep(2);

      const timeout = document.querySelector('[class*="Notification-red"]');
      if (timeout) {
        console.log("auto like timeout");
        buttons.unshift(item);

        await sleep(cacheTimeout || timeout);
        timeout += timeout;
        localStorage.setItem(CACHE_KEY, timeout);
        cacheTimeout = timeout;
      }
    }
  }

  nextPage();
};

like();
