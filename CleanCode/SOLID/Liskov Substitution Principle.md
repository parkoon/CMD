# Liskov Substitution Principle

> 복제하라

"자식 클래스는 최소한 부모 클래스에서 가능한 행위는 수행할 수 있어야한다." 가 `리스코프 치환 원칙`이다.

첫 줄에 `복제하라`는 객체지향에서 `상속`을 의미한다. 자바스크립트에서는 `extends` 키워드를 이용해 상속을 할 수 있으면 `super` 메소드를 통해 부모 클래스의 특징과 기능을 복제 할 수 있다.

아래 예제 코드를 보자.

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get width() {
    return this.width;
  }

  get height() {
    return this.height;
  }

  set width(value) {
    this.width = value;
  }

  set height(value) {
    this.height = value;
  }

  get area() {
    return this.width * this.height;
  }
}
```

위에 작성된 `Rectangle` 클래스 다음과 같은 기능을 가지고 있다.

1. 너비값, 높이값 반환
2. 너비값, 높이값 입력
3. 영역 넓이 계산 및 반환

`리스코프 복제 원칙` 에 따르면 `Rectangle` 클래스를 상속받은 자식 클래스는 위 3가지 기능을 정상적으로 수행할 수 있어야한다.

`Rectangle` 클래스를 상속받은 `Square` 클래스의 코드는 다음과 같다.

```javascript
class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }
}
```

`super()` 메소드를 통해 `width` 와 `height`를 모두 초기화 했고, 모든 속성과 기능을 물려 받았다. 하지만, `Square` 는 `Rectangle` 과 다르게 정사각형의 넓이값을 반화해야하는 특수성을 지닌다. 특수성을 기억하고 아래 코드를 실행해보자

```javascript
function increaseRectangleWidth(rectangle) {
  rectangle.setWidth(rectangle.width + 1);
}

const rectangle = new Rectangle(10, 2);
const square = new Square(5, 5);

increaseRectangleWidth(rectangle);
increaseRectangleWidth(square);

console.log(rectangle1.area()); // 22
console.log(rectangle2.area()); // (1) 30 ? 36?
```

(1) 의 결과는 `36`이 아닌 `30`이 나오게된다. 리스코프 원칙이 지켜지지 못했다.

어떻게 수정할 수 있으까?

## _부모에게 물려받은 메서드명을 일치시키고, 내용을 다르게 구현하자_

사람의 특징을 모두 전달받았지만, 세부적인 생김새는 모두 다른것과 같은 이치다.

수정된 코드는 아래와 같다.

```javascript
class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  set width(value) {
    this.width = value;
    this.height = value;
  }

  set height(value) {
    this.height = value;
    this.width = value;
  }
}
```

정사각형의 특수성인 `너비와 높이가 같다`를 하위 클래스에 다시 입력해주면 된다.

`복제` 는 게으른 개발자가 되기 위한 필수조건이다. 게으른 개발자가 되고 싶은가? 제대로 `복제하라`

## 참고

- [3편 객체지향 설계 5원칙 SOLID] (https://webdoli.tistory.com/212)
- [Liskov Substitution Principle Explained - SOLID Design Principles](https://www.youtube.com/watch?v=dJQMqNOC4Pc&list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9&index=3)
