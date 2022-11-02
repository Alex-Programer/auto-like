# 知乎自动赞同、点赞脚本

## 脚本代码

```javascript
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
```

## 使用方法

1、打开某个答主的主页，切换到回答的标签界面，例如：

![alt demo](/demo.png)

2、打开控制台，执行脚本即可

3、保持页面打开状态，不要关闭。一旦关闭后再次打开请重新执行脚本
