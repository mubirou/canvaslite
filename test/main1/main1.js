/*
_param1 = location.search.match(/param1=(.*?)(&|$)/)[1];
console.log(_param1);
_param2 = location.search.match(/param2=(.*?)(&|$)/)[1];
console.log(_param2);
*/

//==========================
//作品リストとそのランダム化
//==========================
_videoList = [
    "AS-1","AS-2","AS-3","AS-4","AS-5","AS-6","AS-7","AS-8","AS-9","AS-10","AS-16","AS-17","AS-18","AS-20",
    "DA-24",
    "DAP-1","DAP-2","DAP-3","DAP-4","DAP-5",
    "DAS-1","DAS-2","DAS-3","DAS-4","DAS-5","DAS-6","DAS-7","DAS-8","DAS-9","DAS-10",
    "DB-30",
    "DG-21",
    "DK-10","DK-11","DK-12","DK-13","DK-14","DK-15","DK-16",
    "DN-50","DN-56","DN-57","DN-58","DN-59","DN-62","DN-63","DN-64","DN-65","DN-66","DN-67","DN-68","DN-69","DN-70","DN-71","DN-72","DN-73","DN-75","DN-76","DN-77","DN-78","DN-79","DN-80","DN-81","DN-82","DN-83",
    "DOK-1_1","DOK-1_2","DOK-1_3","DOK-1_4","DOK-1_5","DOK-1_6",
    "DOK-2_1","DOK-2_2","DOK-2_3","DOK-2_4","DOK-2_5","DOK-2_6","DOK-2_7",
    "DP-3",
    "DS-2","DS-3"
]

//_videoList = ["AS-1","AS-2","AS-3"];

randomArray = (_array) => { //作品リストをランダムにする
    _arrayCopy = _array.concat(); //複製
    _arrayNew = [];
    for (let i=0; i<_array.length; i++) { //0～80（81作品の場合）
        let _theNum = Math.floor(Math.random() * (_arrayCopy.length-1 + 1)); //整数の乱数
        let _video = _arrayCopy.splice(_theNum,1)[0];
        _arrayNew.push(_video);
    }
    return _arrayNew;
}

_videoRandamList = randomArray(_videoList);


//======
// main1
//======
addEventListener("load", load_window, false);

function load_window() {
    _isMove = false;
    _choiceBitmap = undefined;
    _disX = _disY = 0;
    _mouseX = _mouseY = 0;

    //Canvas
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //Text
    _text = new toile.Text("SHINANOJS");
    _text.addWebFont("ZilapAfricademo", "../demo/Zilap Africa demo.ttf", "opentype");
    _text.font = "ZilapAfricademo";
    _text.size = 80;
    _text.x = 20;//12;
    _text.y = 5; //-1;
    _text.color = "#222222";
    _text.alpha = 1;
    _canvas.addChild(_text);

    //Bitmap
    _bitmapArray = [];
    for (let i = 0; i < 81; i++) { //81作品の場合（0,1,2...79,80）
        let _theVideoName = _videoRandamList.pop();
        let _bitmapPlus2 = new BitmapPlus2("png/" + _theVideoName + ".png", false, "255,255,255", "0,0,0",4);
        _bitmapPlus2.name = _theVideoName;
        _bitmapPlus2.addEventListener("load", load_bitmap);
        _bitmapPlus2.addEventListener("mousedown", mousedown_bitmap);
        _bitmapPlus2.addEventListener("mouseup", mouseup_bitmap);

        _canvas.addChild(_bitmapPlus2);

        //_bitmapPlus2.x = 50 + (_canvas.width - 240) * Math.random();
        //_bitmapPlus2.y = 50 +  (_canvas.height - 300) * Math.random();
        _bitmapPlus2.addEventListener("mousedown", mousedown_bitmap);
        _bitmapPlus2.addEventListener("mouseup", mouseup_bitmap);
        _bitmapPlus2.addEventListener("mouseupoutside", mouseup_bitmap);
        _bitmapPlus2.addEventListener("load", load_bitmap);

        _bitmapArray.push(_bitmapPlus2);
    }

    //NEXT BUTTON
    _next = new toile.Bitmap("../demo/next.png");
    _next.scale = 0.5;
    _next.x = _canvas.width - 70;
    _next.y = _canvas.height - 70;
    _next.addEventListener("mouseup", mouseup_next);
    _canvas.addChild(_next);
}

mouseup_next = (_bitmapPlus2) => {
    location.href = "../main0/index0.html";
}

load_bitmap = (_bitmapPlus2) => {
    _bitmapPlus2.width = 140;
    _bitmapPlus2.height = 200;
    _bitmapPlus2.x = 50 + (_canvas.width - 240) * Math.random();
    _bitmapPlus2.y = _canvas.height;
    _bitmapPlus2.__posY = 50 + (_canvas.height - 300) * Math.random();
    _bitmapPlus2.__disY = _bitmapPlus2.y - _bitmapPlus2.__posY;

    _bitmapPlus2.__timerID = setTimeout(callback_start, 1000*Math.random(), _bitmapPlus2);
}

callback_start = (_bitmapPlus2) => {
    _bitmapPlus2.__count = 0;
    clearTimeout(_bitmapPlus2.__timerID);
}

enterframe_canvas = (_canvas) => {
    if (_isMove) {
        _mouseX = _canvas.mouseX; //for Mobile
        _mouseY = _canvas.mouseY; //for Mobile
        _choiceBitmap.x = _mouseX - _disX;
        _choiceBitmap.y = _mouseY - _disY;
    }

    _bitmapArray.forEach(function(_bitmapPlus2) {
        if (_bitmapPlus2.__count != undefined) {
            _bitmapPlus2.__count += 0.03;
            if (_bitmapPlus2.y > _bitmapPlus2.__posY + 1) {
                _bitmapPlus2.y = (_bitmapPlus2.__posY + _bitmapPlus2.__disY) +  _bitmapPlus2.__disY * Math.cos(_bitmapPlus2.__count);
            } else {
                _bitmapPlus2.y = _bitmapPlus2.__posY;
                //ここでカウントを取って全部終了したらenterframe_canvasの中身を変更しよう!!!!!!!!!!!!!!!!!!!!!!!
            }
        }
    });
    _canvas.drawScreen();
}

mousedown_bitmap = (_bitmapPlus2) => {
    //console.log("mouseDown: " + _bitmapPlus2.name);
    _canvas.setDepthIndex(_bitmapPlus2, _canvas.getDepthMax());
    _canvas.stopMouseDownEvent();
    _isMove = true;
    _choiceBitmap = _bitmapPlus2;

    _disX = _canvas.mouseX - _bitmapPlus2.x;
    _disY = _canvas.mouseY - _bitmapPlus2.y;
}

mouseup_bitmap = (_bitmapPlus2) => {
    console.log("mouseUp: " + _bitmapPlus2.name);
    _canvas.stopMouseUpEvent();
    _isMove = false;
    _choiceBitmap = undefined;
}

mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}