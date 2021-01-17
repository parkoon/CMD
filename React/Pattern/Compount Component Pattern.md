# Compound Component Pattern

`Compound Component`란 내부 `state`를 공유하며 서로 상호작용하는 컴포넌트들을 내부 `static` 컴포넌트로 작성하고 사용자에게 내부 로직은 추상화하고, 이외의 로직 작성을 독립적으로 작성할 수 있게 해주는 패턴이다.

[antd](https://ant.design/components/form/) 의 `Form` 컴포넌트에 `Compound Component` 패턴이 적용된 것을 볼 수 있다.

내부 `state` 를 `React.cloneElement` 를 통해 `static` 컴포넌트끼리 소통하거나, `Context API`를 통해서 소통할 수 있다.

## Using React.cloneElement & React.Children.map

---

첫 번째로 `React.cloneElement`를 사용하는 방법으로 `React.cloneElement`는 자식 컴포넌트에게 특정 값이나 기능을 주입할 때 사용된다.

```javascript
function App() {
  return (
    <Wizard>
      <Wizard.Step>A</Wizard.Step>
      <Wizard.Step>B</Wizard.Step>
      <Wizard.Step>C</Wizard.Step>
    </Wizard>
  );
}
```

`App` 컴포너트에서는 추상화된 `Wizard` 와 `Wizard.Step` 컴포넌트를 이용해서 스텝을 표현하고 있다.

사용자자는 `Wizard` 컴포넌트가 어떻게 돌아가는지 몰라도 된다. `Wizard` 자식으로 `Wizard.Step` 만 작성해주면 된다.

```javascript
function Step({ children, currentIndex, nextStep, prevStep, isLast, isFirst }) {
  return (
    <div>
      <div>
        {children} # {currentIndex}
      </div>
      <button disabled={isFirst} onClick={prevStep}>
        prev step
      </button>
      <button disabled={isLast} onClick={nextStep}>
        next step
      </button>
    </div>
  );
}

function Wizard({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    if (currentIndex !== children.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentIndex !== 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  return (
    <div>
      {React.Children.map(children, (el, index) => {
        if (index === currentIndex) {
          return React.cloneElement(el, {
            currentIndex,
            nextStep,
            prevStep,
            isLast: currentIndex === children.length - 1,
            isFirst: currentIndex === 0,
          });
        }
        return null;
      })}
    </div>
  );
}

Wizard.Step = Step;
```

`React.Children.map` 을 통해 전달 받은 자식을 루프돌면서 `React.cloneElement`를 통해 자식에게 상태와 기능을 주입해주고 있다.

> 클래스 컴포넌트를 사용하면 `static` 키워드를 통해 `Wizard` 에 `Step` 컴포넌트를 넣어 줄 수 있다.

```javascript
class Wizard extends React.Component {
    static Step = () => <Step />
    ...
}
```

## Using Context API

---

`Context` 를 알고 있다면, 아래 코드는 쉽게 이해할 수 있다.

```javascript
function App() {
  return (
    <Wizard>
      <Wizard.Step>A</Wizard.Step>
      <Wizard.Step>B</Wizard.Step>
      <Wizard.Step>C</Wizard.Step>
    </Wizard>
  );
}
```

```javascript
const StepContext = React.createContext();

function Step({ children }) {
  const { currentIndex, nextStep, prevStep, isLast, isFirst } = useContext(
    StepContext
  );
  return (
    <div>
      <div>
        {children} # {currentIndex}
      </div>
      <button disabled={isFirst} onClick={prevStep}>
        prev step
      </button>
      <button disabled={isLast} onClick={nextStep}>
        next step
      </button>
    </div>
  );
}

function Wizard({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    if (currentIndex !== children.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentIndex !== 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const value = {
    currentIndex,
    nextStep,
    prevStep,
    isLast: currentIndex === children.length - 1,
    isFirst: currentIndex === 0,
  };
  return (
    <StepContext.Provider value={value}>
      {React.Children.map(children, (el, index) => {
        if (index === currentIndex) {
          return children[currentIndex];
        }
      })}
    </StepContext.Provider>
  );
}

Wizard.Step = Step;
```
