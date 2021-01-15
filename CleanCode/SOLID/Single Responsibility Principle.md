# Single Responsibility Principle

**단일 책임의 원칙** 으로 작성된 클래스는 하나의 책임만 갖는다. 객체지향에서 **책임**이란 객체가 **할 수 있는 것** 과 **해야 하는 것** 으로 나뉜다. 다시 말해, `하나의 책임을 갖는다는 것` 은 곧 `객체는 자신이 할 수 있고 해야하는 것만 수행할 수 있도록 설계` 되어야 한다는 것이다.

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
