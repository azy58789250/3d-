/**!
 * [重庆智能]
 * date:2019-07-22
 * author: [xhz];
 */
$(function () {
  var $obox = $('#drag-container'),
    $ospin = $('#spin-container'),
    $item = $('.item');
  var radius = 700;
  var autoRotate = true; //是否自转
  // 卡片宽高
  var imgWidth = 160; 
  var imgHeight = 190;
  var firstInit = true;
  var rotate = 0;//初始化角度
  var animateId;
  var aveAng = 360 / ($item.length);
  var lock = false;

  // 设置鼠标拖拽的运动类型：“3d”是3d翻滚，“rotate”是左右滑动
  var moveType='3d';
$('.type').on('click','span',function(){
  cancelAnimationFrame(animateId);
  $(this).addClass('active').siblings().removeClass('active')
  moveType=$(this).data('style');
  firstInit = true;
  rotate=0;
  tX = 15;
  tY = 19;
  for (var i = 0; i < $item.length; i++) {
    $item[i].style.transform = "rotateY(0deg) translateZ(0px)";
    $item[i].style.transition = "all 0s";
  }
  console.log(moveType)
  drag(moveType);

  setTimeout(init, 100);
})

  drag(moveType);
  setTimeout(init, 100);

  $ospin.css('width', imgWidth + "px")
  $ospin.css('height', imgHeight + "px")

  //  初始化
  function init(delayTime) {
    for (var i = 0; i < $item.length; i++) {
      $item[i].style.transform = "rotateY(" + (i * (360 / $item.length)) + "deg) translateZ(" + radius + "px)";
      $item[i].style.transition = "all 1s";
      // $item[i].style.transitionDelay = delayTime || ($item.length - i) / 4 + "s"; //进场动画
    }

    if (firstInit) {
      firstInit = false
      setTimeout(function () {
        // init(1)
        if (autoRotate) {
          animateId = requestAnimationFrame(move);
        }
        // }, ($item.length * 1000 / 4) + 1000)
      }, 100)

    }

  }

  function move() {
    if (!autoRotate) {
      return
    }
    rotate = rotate - 0.2;
    var curIdx = Math.floor($item.length - rotate / aveAng);

    if (curIdx == $item.length) {
      curIdx = 0
    }
    $('.item').eq(curIdx).addClass('active').siblings().removeClass('active')

    if (rotate <= 0) {
      rotate = 360
    }
    $ospin.css('transform', 'rotateY(' + (rotate) + 'deg)')
    animateId = requestAnimationFrame(move);
  }

  function applyTranform(obj) {
    obj.css('transform', "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)")
  }
  // 鼠标拖拽3D翻转
  var desX = 0,
    desY = 0,
    tX = 15,
    tY = 19;
  var dragTimer;
  // 鼠标拖拽
  function drag(motion) {
    if (motion == 'rotate') {
      document.onmousedown = function (e) {
        e = e || window.event;
        if ($(e.target).parents().hasClass('item') || $(e.target).hasClass('item')) {
          return
        } else {
          clearInterval(dragTimer);
          cancelAnimationFrame(animateId)
          var sX = e.clientX,
            sY = e.clientY;
          tX = rotate;
          tY = 0;
        }

        this.onmousemove = function (e) {
          e = e || window.event;
          if ($(e.target).parents().hasClass('item') || $(e.target).hasClass('item')) {
            return
          }
          var nX = e.clientX,
            nY = e.clientY;
          desX = nX - sX;
          desY = nY - sY;
          tX += desX * 0.1;
          rotate = tX
          applyTranform($ospin);
          sX = nX;
          sY = nY;
        }

        this.onmouseup = function (e) {
          this.onmousemove = this.onmouseup = null;
          if ($(e.target).parents().hasClass('item') || $(e.target).hasClass('item')) {
            clickItem($(e.target).closest('.item'))
            return
          }
          animateId = requestAnimationFrame(move)
          dragTimer = setInterval(function () {
            desX *= 0.95;
            tX += desX * 0.1;
            rotate = tX
            applyTranform($ospin);
            if (Math.abs(desX) < 0.5) {
              clearInterval(dragTimer);
            }
          
          }, 13);
        }
        return false;
      }
    } else if (motion == '3d') {
      document.onmousedown = function (e) {
        cancelAnimationFrame(animateId);
        clearInterval(dragTimer);
        e = e || window.event;
        var sX = e.clientX,
          sY = e.clientY;

        this.onmousemove = function (e) {
          e = e || window.event;
          var nX = e.clientX,
            nY = e.clientY;
          desX = nX - sX;
          desY = nY - sY;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTranform($obox);
          sX = nX;
          sY = nY;
        }

        this.onmouseup = function (e) {
          this.onmousemove = this.onmouseup = null;
          animateId = requestAnimationFrame(move)
          dragTimer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform($obox);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
              clearInterval(dragTimer);
              
            }
          
          }, 13);
        }
        return false;
      }
    }

  }
  //滚动条滑动
  document.onmousewheel = function (e) {
    e = e || window.event;
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
  };

  $ospin.on('click', '.item', function () {
    clickItem($(this))
  })
  //点击卡片
  function clickItem($this) {
    if (!lock) {
      cancelAnimationFrame(animateId)
      lock = true;
      var curidx = $this.index();
      $('.item').eq(curidx).addClass('active').siblings().removeClass('active')
      var gap = 360 * curidx / $item.length;
      rotate = 360 - gap;
      $ospin.css('transition', 'all 1s')
      $ospin.css('transform', 'rotateY(' + (rotate) + 'deg)')
      setTimeout(function () {
        // if (!lock) {
        //   return
        // }
        if (rotate <= 0) {
          rotate = rotate + 360
        }
        $ospin.css('transition', 'none')
        cancelAnimationFrame(animateId)
        animateId = requestAnimationFrame(move);
        lock = false;
      }, 1000)

    }
  }


})