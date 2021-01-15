class CalorieTracker {
  constructor(maxCalories) {
    this.maxCalories = maxCalories;
    this.currentCalories = 0;
  }

  trackCalories(calorieCount) {
    this.currentCalories += calorieCount;
    if (this.currentCalories > this.maxCalories) {
      this.logCalorieSurplus();
    }
  }
  logCalorieSurplus() {
    console.log("Max calories exceeded");
  }
}
// 현재 2개의 책임을 가지고 있다.
// 1. 칼로리를 측정한다.
// 2. 칼로리를 로깅하고 있다.
// 만약에, 단순히 로깅을 하는 것이 아닌, 사용자에게 문자를 보낸다고하면
// 위 클래스는 수정해야한다.
// 단일 책임 원칙에 위배되었다.

const calorieTracker = new CalorieTracker(2000);

calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(500);
