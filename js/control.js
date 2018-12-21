const target = document.querySelector('#joystick .arows > div');
const joystick = document.querySelector('#joystick .arows');
// const joystickZone = document.getElementById('joystick');
let start = 0;
let current = 0;
let dif = 0;

function reset() {
  // joystick.style.display = 'none';
  joystick.style.transform = 'translateY(0px) rotate(45deg)';

  start = 0;
  current = 0;
  dif = 0;
}

function h(e) {
  const pageY = e.targetTouches[0].pageY || e.pageY;
  e.preventDefault();
  if (e.target === target) {
    if (start === 0) start = pageY;
    current = pageY;
    dif = current - start;
    console.log(e);
    console.log(dif);
    joystick.style.transform = `translateY(${dif}px) rotate(45deg)`;
    if (dif < -40) {
      document.removeEventListener('touchmove', h);
      board.controler({ keyCode: 38 });
      reset();
    }
    if (dif > 40) {
      document.removeEventListener('touchmove', h);
      board.controler({ keyCode: 40 });
      reset();
    }
  }
}

document.addEventListener('touchmove', h, false);

document.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (e.target === target) {
    console.log(e);
    reset();
    // joystick.style.display = 'block';
    document.addEventListener('touchmove', h, false);
  }
}, false);

window.onscroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

// {
//   let i = 0;
//   let j = 0;

//   for (i; i < 5; i += 1) {
//     for (j; j < 5; j += 1) {
//       console.log(`i: ${i}`, `j: ${j}`);
//     }
//     j = 0; // нужно сбросить
//   }
// }
