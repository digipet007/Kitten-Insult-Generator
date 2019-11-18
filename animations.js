$(document).ready(function() {
  var cat = anime({
    targets: ".sway",
    translateY: [
      { value: 150, duration: 500 },
      { value: 0, duration: 500 }
    ],
    rotate: {
      value: "1turn",
      easing: "easeInOutSine"
    },
    autoplay: false,
    loop: false
  });

  document.querySelector(".newInsults").onclick = cat.play;
});
