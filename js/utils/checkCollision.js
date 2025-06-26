let relativeLeft1;
let relativeRight1;
let relativeTop1;
let relativeBottom1;

let relativeLeft2;
let relativeRight2;
let relativeTop2;
let relativeBottom2;

export function checkCollision(car1, car2) {
  let rect1 = car1.autoElement.getBoundingClientRect();
  let rect2 = car2.autoElement.getBoundingClientRect();

  relativeLeft1 = (rect1.left / window.innerWidth) * 100;
  relativeRight1 = (rect1.right / window.innerWidth) * 100;
  relativeTop1 = (rect1.top / window.innerHeight) * 100;
  relativeBottom1 = (rect1.bottom / window.innerHeight) * 100;

  relativeLeft2 = (rect2.left / window.innerWidth) * 100;
  relativeRight2 = (rect2.right / window.innerWidth) * 100;
  relativeTop2 = (rect2.top / window.innerHeight) * 100;
  relativeBottom2 = (rect2.bottom / window.innerHeight) * 100;

  const margin = 0.8;

  return (
    ((relativeLeft1 > 35 && relativeLeft1 < 65) ||
      (relativeLeft2 > 35 && relativeLeft2 < 65)) &&
    ((relativeTop1 > 35 && relativeTop1 < 65) ||
      (relativeTop2 > 35 && relativeTop2 < 65)) &&
    relativeLeft1 + margin < relativeRight2 &&
    relativeRight1 - margin > relativeLeft2 &&
    relativeTop1 + margin < relativeBottom2 &&
    relativeBottom1 - margin > relativeTop2
  );
}
