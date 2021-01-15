# Open Close Principle

**개방폐쇄의 원칙** 이란, 확장에는 열려있고, 변경에는 닫혀있어야 한다는 원리다. 기획 변경이나 추가사항이 발생하더라도, 기존의 코드는 수정이 일어나지 말아 야 하며, 쉽게 확장해서 재상용 할 수 있다는 의미로 보면 된다.

아래 코드는 전달받은 `question` 객체를 `switch` 문을 이용해 `type` 일 비교해 `type` 에 맞게 값을 콘솔로 나타내고 있다.

```javascript
function printQuiz(questions) {
  questions.forEach((question) => {
    console.log(question.description);

    switch (question.type) {
      case "boolean":
        console.log("1. true");
        console.log("2. false");
        break;

      case "text":
        console.log("Answer: ____________");
        break;
    }
    console.log("");
  });
}

const questions = [
  {
    type: "boolean",
    description: "This post is useful",
  },
  {
    type: "text",
    description: "Describe your favorite JS feature",
  },
];
```

보기엔 큰 문제 없고 생각대로 잘 짜여진거 같다. (가독성도 그렇게 나쁘지 않다.)

하지만 `Open Close` 원칙엔 위배되었다.

> 기획자 왈, `What is your favorite language?` 질문으로 여러 항목을 출력해주고 선택할 수 있는 퀴즈도 추가해주세요.

기획 의도에 맞게 구현하려면 `type` 은 multiple 로 하면되고, `description` 은 What is your favorite language? 로 하고, 리스트로 출력할 options 는... (이런거 생각 안했는데...)

일단, `type` 과 `description` 만 있던 구조부터 바꼈다. (타입스크립트를 사용해서 타입을 지정해놓았다면 타입도 수정해야 할 지경이다.)

## _그래도 수정해보자_

```javascript
function printQuiz(questions) {
  questions.forEach((question) => {
    console.log(question.description);

    switch (question.type) {
      case "boolean":
        console.log("1. true");
        console.log("2. false");
        break;

      case "text":
        console.log("Answer: ____________");
        break;

      // 수정 (1)
      case "multiple":
        question.options.forEach((option, index) => {
          console.log(`${index + 1}. ${option}`);
        });
    }
    console.log("");
  });
}

const questions = [
  {
    type: "boolean",
    description: "This post is useful",
  },
  {
    type: "text",
    description: "Describe your favorite JS feature",
  },

  // 수정 (2)
  {
    type: "multiple",
    description: "What is your favorite language?",
    options: ["CSS", "HTML", "JS", "Python"],
  },
];
```

수정 (2) 는 확장을 위해 어쩔수 없다 하더라도, 수정(1) 의 경우는 비즈니스 로직을 변경하고 있다. 바로 **확장에는 열려있었지만 변화에 닫혀있지 못했다.**

가독성 망가뜨리는건 덤이다.

## 리팩토링 시작

switch 문을 클래스로 변경을 한다. 이 부분은 리팩터링 2판 10장4절에 **조건부 로직을 다형성으로 바꾸기**에도 나온다.

```javascript
class BooleanQuestion {
  constructor(description) {
    this.description = description;
  }

  printQuestion() {
    console.log("Answer: ____________");
  }
}
class TextQuestion {
  constructor(description) {
    this.description = description;
  }

  printQuestion() {
    console.log("1. true");
    console.log("2. false");
  }
}

function printQuiz(questions) {
  questions.forEach((question) => {
    console.log(question.description);
    question.printQuestion();
    console.log("");
  });
}

const questions = [
  new BooleanQuestion("This post is useful"),
  new TextQuestion("Describe your favorite JS feature"),
];

printQuiz(questions);
```

우리는 이제 어떤 허술한 기획이와도 확장할 수 있는 코드를 갖췄다. 위에서 추가한 `type: multiple` 의 경우를 추가해보자. 클래스만 추가하면 된다.

```javascript
class BooleanQuestion {
  constructor(description) {
    this.description = description;
  }

  printQuestion() {
    console.log("Answer: ____________");
  }
}
class TextQuestion {
  constructor(description) {
    this.description = description;
  }

  printQuestion() {
    console.log("1. true");
    console.log("2. false");
  }
}

// 추가
class MultipleChoices {
  constructor(description, options) {
    this.description = description;
    this.options = options;
  }

  printQuestion() {
    this.options.forEach((option, index) => {
      console.log(`${index + 1}. ${option}`);
    });
  }
}

function printQuiz(questions) {
  questions.forEach((question) => {
    console.log(question.description);
    question.printQuestion();
    console.log("");
  });
}

const questions = [
  new BooleanQuestion("This post is useful"),
  new TextQuestion("Describe your favorite JS feature"),
  // 추가
  new MultipleChoices("What is your favorite language?", [
    "CSS",
    "HTML",
    "JS",
    "Python",
  ]),
];

printQuiz(questions);
```

~~기획 구멍에 대한 스트레스 삭-제 🔥~~

## 참고

- [Open/Closed Principle Explained - SOLID Design Principles](https://www.youtube.com/watch?v=-ptMtJAdj40&list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9&index=2)
