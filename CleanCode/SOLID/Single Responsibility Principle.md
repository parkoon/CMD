# Single Responsibility Principle

**단일 책임의 원칙** 으로 작성된 클래스는 하나의 책임만 갖는다.

쉽게 와닿지 않는 문장이다.

초밥집을 예시로 보자.

_초밥집에 들어가 자리에 앉으니 점원(A)이 메뉴판을 가져다 준다. A를 불러 모듬 초밥을 시켰다. A는 주방에 들어가 회를 뜨기 시작한다. 그리고 밥을 동그랗게 만들고 회를 올려서 접시에 플레이팅을 시작한다. 플레이팅이 끝난 음식을 A가 테이블로 전달해준다. 다먹고 계산하려 카운터에 가니 A가 계산을 해준다._

만약 위 식당에서 아래와 같은 문제가 발생한다면 누구의 책임인가?

1. 테이블이 더럽다.
2. 초밥에 와사비가 빠졌다.
3. 결제 금액이 맞지 않는다.

책임 소재가 불분명하면 모든 문제에 대해서 시스템 전체가 움직여야 한다.

이로써 얻을 수 있는 것은, 클래스가 어떤 일을 하는지 명확히 알 수 있을 뿐 아니라, 코드 수정의 빈도수도 현저히 줄어들 것이다.

```javascript
import loggingA from "loggingA";

class CalorieTracker {
  constructor(maxCalories) {
    this.maxCalories = maxCalories;
    this.currentCalories = 0;
  }

  trackCalories(calorieCount) {
    thi.currentCalories += calorieCount;
    if (this.currentCalories > this.maxCalories) {
      this.logCalorieSurplus();
    }
  }
  logCalorieSurplus() {
    loggingA("Max calories exceeded");
  }
}
```

칼로리를 측정하고 칼로리가 넘쳤을 때 로깅을 하는 클래스다.
2가지 변화에 반응을 하기 때문에 위 코드는 `단일 책임 원칙` 에 위배되었다고 할 수 있다.

1. 칼로리를 측정한다.
2. 칼로리를 로깅하고 있다.

칼로리를 로깅하는 모듈을 `loggingA` 에서 `loggingB` 로 변경한다면 `CalorieTracker` 를 수정해야 할 것이다.

`단일 책임 원칙`에 따라 수정하면 아래와 같을 것이다.

```javascript
import logging from "./logging";
class CalorieTracker {
  constructor(maxCalories) {
    this.maxCalories = maxCalories;
    this.currentCalories = 0;
  }

  trackCalories(calorieCount) {
    thi.currentCalories += calorieCount;
    if (this.currentCalories > this.maxCalories) {
      this.logCalorieSurplus();
    }
  }
  logCalorieSurplus() {
    logging("Max calories exceeded");
  }
}
```

```javascript
import loggingA from "loggingA";
export default function logging(message) {
  loggingA(message);
}
```

이제 `CalorieTracker` 수정 없이 마음껏 로깅 모듈을 변경할 수 있게 되었다.

## 참고

- [Single Responsibility Principle Explained - SOLID Design Principles
  ](https://www.youtube.com/watch?v=UQqY3_6Epbg&list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9)
