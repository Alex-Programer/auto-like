let timeout = 60 * 30; // 请求超时后等待半小时再执行，单位：秒

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
      item.click();
      await sleep(2);

      const timeout = document.querySelector('[class*="Notification-red"]');
      if (timeout) {
        console.log("timeout");
        buttons.unshift(item);
        await sleep(timeout);
        timeout += timeout; // 每超时一次，等待时间就翻倍
      }
    }
  }

  nextPage();
};

like();
