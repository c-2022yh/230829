//맨 밑에 함수를 먼저 보도록
//자바스크립트는 자료형이 없음 다 var, let은 지역변수(함수 내 사용)

//캔버스 불러옴
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");


//랭킹관련(미구현)
var nameP = document.getElementById("nameP");
var scoreP = document.getElementById("scoreP");

//타임변수(미구현)
var LTime = Date.now();
var RTime =0;

var deltaTime = 0.000001;

//파일입출력관련(미구현)
const file = new File(["foo"],"C.csv");

const inputF = document.querySelector("input");

inputF.addEventListener("change",(e) => {
    const fileF = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e)
    {
        console.log(e.target.files);
    }
    

})

const blob = new Blob();
const reader = new  FileReader();
//reader.readAsText(B);

reader.onload = function (e)
{
    console.log(e.B);
}

//reader.readAsText()
//-------------------------------변수 설정-------------------------------
var floorX=60;
var floorY=40;

var upMarginY=120;
var downMarginY=60;
var upBar = upMarginY;
var downBar = myCanvas.height-downMarginY;

var mousePointX=0;
var mousePointY=0;
var mouseX=0;
var mouseY=0;

var onMouseMoving=0;
var onMouseClick=0;

var f5=0;


//객체 클래스 선언
//class에 constructor함수는 생성자
//자바스크립트는 public, private 없음 다 퍼블릭
//추가로 필드개념이없음 생성자에서 this.어쩌구 하면 그게 필드임
//전체 유닛에 대한 객체, 모든 객체는 유닛클래스를 상속받음
class Unit
{
    //생성자 xy값을 받아서 좌표설정
    constructor(_x,_y)
    {
        this.x=_x;
        this.y=_y;
        this.color="rgb(0,0,0)";
    }
    //컬러 설정하는 함수
    setColor(_s)
    {
        this.color=_s;
    }
    //렌더-> 메소드 오버라이딩 밑에 각 클래스마다 본인 타입에 알맞게 구현
    //전부 html 캔버스에 출력하는 함수라 해석할필요없음
    render()
    {
        
    }
}
//텍스트 유닛 클래스 구현
class TextUnit extends Unit
{
    //텍스트 이므로 xy외 다른기능 추가구현 텍스트 폰트 정렬 등
    constructor(_x,_y)
    {
        super(_x,_y);
        this.color="black";
        this.text="test";
        this.font="bold 15px Arial";
        this.align="center";

        this.render();
    }
    //setter함수들 구현
    setXY(_x, _y)
    {
        this.x=_x;
        this.y=_y;
    }
    setText(_s)
    {
        this.text = _s;
    }
    setFont(_s)
    {
        this.font = _s;
    }
    setAlign(_s)
    {
        this.align = _s;
    }
    render()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.align;
        ctx.fillText(this.text,this.x,this.y);
        ctx.closePath();
    }

}
//상하단 바
class Bar extends Unit
{
    constructor(_x,_y)
    {
        super(_x,_y - 10);
        this.width=360;
        this.height=10;
        this.color="rgb(0,0,0)";
        this.render();
    }
    render()
    {
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.width,this.height,false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
//스트로크 (에임라인)
class Stroke extends Unit
{
    constructor(_x,_y,_n)
    {
        super(_x,_y);

        this.lineToX =_x;
        this.lineToY =_y;

        this.dashPoint=_n;
        this.lineWidth = 1;

        this.render();
    }

    render()
    {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.lineToX, this.lineToY);
        ctx.setLineDash([this.dashPoint]);
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    setLineTo(_x, _y)
    {
        this.lineToX=_x;
        this.lineToY=_y;
    }
    
    setLineWidth(_n)
    {
        this.lineWidth=_n;
    }

}
//화살
class Arrow extends Unit
{
    constructor(_x,_y)
    {
        super(_x,_y);

        this.lineToX=_x;
        this.lineToY=_y;
        this.angle = 0;

        this.onRender=0;
        this.render();
    }

    render()
    {
        if(this.onRender==1)
        {
            let l=15;
            let a=155;
            ctx.beginPath();
            ctx.moveTo(this.lineToX, this.lineToY);
            ctx.lineTo(this.lineToX + l * Math.cos(setLessThan360Angle(this.angle+a) * Math.PI / 180),
             this.lineToY - l * Math.sin(setLessThan360Angle(this.angle+a) * Math.PI / 180));
            ctx.lineTo(this.lineToX + l * Math.cos(setLessThan360Angle(this.angle-a) * Math.PI / 180),
             this.lineToY - l * Math.sin(setLessThan360Angle(this.angle-a) * Math.PI / 180));
            ctx.fillStyle="rgba(128,128,255,0.5)";
            ctx.fill();
            ctx.closePath();
        }
        
    }

    setLineTo(_x, _y)
    {
        this.lineToX=_x;
        this.lineToY=_y;
    }
}
//공(화살표 뒤에 찍히는 예상타격위치 표시하는 공)
class Ball extends Unit
{
    constructor(_x,_y)
    {
        super(_x,_y);
        this.radius=8;
        this.color="rgba(128,128,255,0.5)";
        this.onRender=0;
        this.render();
    }
    render()
    {
        if(this.onRender==1)
        {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
    }
}

//플레이어(공)
class Player extends Unit
{
    constructor(_x,_y)
    {
        super(_x,_y);

        this.dx;
        this.dy;

        //반지름
        this.radius=8;
        //각도
        this.angle=90;

        //발사되었는지?
        this.onShooting=0;
        //땅에 떨어졌는지?
        this.onLanding=0;

        this.color="rgb(128,128,255)";
        
        //쏠 준비가 되었는지? 드래그 후 각도조정을 완료했을 때
        this.readyForShot=0;


        this.render();
    }
    
    render()
    {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    setAngle(_r)
    {
        this.angle = _r;
    }

    //발사하는 함수 각도조정 후 각도만큼 발사
    //각이 0도나 180도면 게임이 안끝나기 때문에 각도보정
    //공이 바닥에 떨어지면 스탑
    shot()
    {
        if(this.readyForShot==1)
        {
            this.x+=this.dx*Math.cos(this.angle*Math.PI / 180);
            this.y-=this.dy*Math.sin(this.angle*Math.PI / 180);
            this.onShooting=1;

            if(this.angle>=0 && this.angle<3) this.setAngle(3);
            else if(this.angle>357) this.setAngle(357);
            else if(this.angle<=180 && this.angle>177) this.setAngle(177);
            else if(this.angle>=180 && this.angle<183) this.setAngle(183);
            
            if(this.y >= downBar-this.radius)
            {
                this.stop();
            }
        }
        
    }
    //공이 멈추면 실행하는 함수 dxdy값을 0으로 만들어 움직이지못하게
    //기타 변수들 조정
    stop()
    {
        this.onShooting=0;
        this.onLanding=1;
        this.dx=0;
        this.dy=0;
        this.y= downBar-this.radius;
    }

}

//벽돌
class Brick extends Unit
{
    constructor(_x,_y,_hp)
    {
        super(_x*floorX,_y*floorY + upMarginY);
        this.hp=_hp;
        this.width=floorX;
        this.height=floorY;
        this.color="rgb(140,30,0)";
        this.isDead=0;
    
        this.render()
    }
    

    //스테이지가 넘어갈때마다 벽돌이 한칸씩 내려오는 함수
    downMove()
    {
        this.y+=floorY;
    }
    
    //벽돌과 공이 충돌할때 피가 1까이는 함수
    //피가 0이되면 없어짐
    hit()
    {
        this.hp -=1;
        if(this.hp<=0)
        {
            this.isDead=1;
        }
    }

    //벽돌이 딸피가 될수록 색이 밝아지는걸 구현하는 함수
    colorChange() 
    {
        let p = this.hp / stage;
        let red = 255 - 105*p;
        let green =180 - 150*p;
        this.color ="rgb("+red+","+green+",0)";
    }

    render()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x+0.5,this.y+0.5,this.width-1,this.height-1,false);
        this.colorChange();
        ctx.fillStyle=this.color;
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font ='bold 15px Arial';
        ctx.textAlign ="center";
        ctx.fillText(this.hp,this.x+floorX/2,this.y+floorY/1.6);
        ctx.strokeStyle = "white";
        ctx.lineWidth=0.5;
        ctx.stroke();
        ctx.closePath();
    }
}

//아이템(초록공)
class Item extends Unit
{
    constructor(_x,_y)
    {
        super(_x*floorX + floorX/2, _y*floorY + floorY/2 + upMarginY)
        this.radius=10;
        this.hp=1;
        this.onLanding=0;
        this.color="rgb(128,255,128)";
        this.render();
    }
    //얘도 벽돌과 같음
    downMove()
    {
        this.y+=floorY;
    }
    //공과 만날떄 hp-1
    hit()
    {
        this.hp-=1;
    }
    //공을 맞추면 땅에 떨어지죠?
    drop()
    {
        if(this.hp<=0 && this.y <= myCanvas.height - downMarginY - this.radius - 1)
        {
            this.y+=1;
        }
        
    }
    render()
    {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}


//-----------------------------게임 세부 설정---------------------------

//스테이지
var stage=1;

//아이템을 먹은 횟수->공을 몇개쏠건지?
var getItem=1;

//플레이어의 x좌표
var playerX = myCanvas.width/2;

//몇발쏠수있는지 x@로 표시하는 변수
var getItemText= undefined;

//움직이지 않는 유닛 리스트 (텍스트, 상하단 바 등)
var unMoveUnitList = [];

//움직이는 유닛 리스트 (공, 벽돌, 기타 텍스트 등)
var moveUnitList = [];


//플레이어 리스트(공이 여러개니깐)
var playerList = [];

//벽돌 리스트
var brickList = [];

//아이템(초록공) 리스트
var itemList = [];

//에임라인(화살표) 리스트
var aimLineList = [];


//쐈는지 안쐈는지?
var onShot=0;

//플레이어 공 연사속도
var delayShotCount=0;

//발사각
var angle=1;

//발사 후 공이 하나라도 떨어졌는지 체크
var onFirstLandCheck=0;

//공이 처음 떨어진 위치
var firstLandX=-1;

//남은 공 수
var remainPlayerBall=1;

//현재 스테이지에 아이템을 주웠는지?
var pickUp=0;


//랭킹(미구현)
var rankingSetting = function()
{

}

//게임 시작 후 초기 유닛세팅
var unitSetting = function()
{
    let b1 = new Bar(0,upMarginY);
    unMoveUnitList.push(b1);

    let b2 = new Bar(0,myCanvas.height - downMarginY+10);
    unMoveUnitList.push(b2);

    let t1 = new TextUnit(myCanvas.width-10,20);
    t1.setText("Beta version");
    t1.setFont("bold 16px Arial");
    t1.setAlign("right");
    unMoveUnitList.push(t1);

    let t2 = new TextUnit(myCanvas.width-10,40);
    t2.setText("Produced By Py");
    t2.setFont("bold 13px Arial");
    t2.setColor("rgb(200,160,18)");
    t2.setAlign("right");
    unMoveUnitList.push(t2);

    let t3 = new TextUnit(myCanvas.width/2,60);
    t3.setText("Score : "+stage);
    t3.setFont("bold 15px Arial");
    moveUnitList.push(t3);

    
    let t4 = new TextUnit(16,15);
    t4.setText("fps: ");
    t4.setFont("14px Arial");
    moveUnitList.push(t4);

}
/*

UnitList[3] = Text(Score: x), Text(fpx), Text(x1)

*/


//플레이어 세팅
var playerSetting = function(_x)
{
    //플레이어리스트를 지우고 아이템을 먹은 갯수만큼 새로생성
    //y값은 0, x는 전 스테이지 처음 공이 떨어진 위치
    playerList=[];
    for (let i=0;i<getItem;i++)
    {
        let p = new Player(_x,downBar-8);
        playerList.push(p);
    }
    
}


//스테이지 만들기(스테이지가 넘어갈때마다 벽돌이 새로 생기고 변수들을 초기화)
var createStage = function()
{

    let vList = [];
    
    let bricksCount=0;
    let isMakeItem=0;
    
    //벽돌을 만들껀데 랜덤값 기반으로 만듬
    //만약 아이템을 못만들었거나, 두개이상 만들었거나, 벽돌을 하나도 못만들면 새로실행
    //vList값 0=빈칸, 1=벽돌, 2=아이템(공)
    for(let i=0;i<6;i++)
    {
        let r = Math.floor(Math.random()*100)
        if(r<50)
        {
            vList[i]=1;
            bricksCount++;
        }
        else if(r>75 && isMakeItem==0)
        {
            vList[i]=2;
            isMakeItem++;
        }
        else
        {
            vList[i]=0;
        }
    }

    if(bricksCount<2 || isMakeItem==0)
    {
        createStage();
    }
    else
    {
        for(let i=0;i<6;i++)
        {
            if(vList[i]==1)
            {
                let b = new Brick(i,1,stage);
                brickList.push(b);
            }
            else if(vList[i]==2)
            {
                let a = new Item(i,1);
                itemList.push(a);
            }
            
        }
    }
    //벽돌이 맨 밑에 땅에 닿으면 게임 종료
    if(brickList[0].y>=440)
    {
        alert("GAME OVER");
        gameOver(stage);
        
    }
    
}


//숫자값 설정
var setNumber = function()
{
    if(onShot==0)
    {
        let t = new TextUnit(playerX,myCanvas.height-35);
        t.setText("x"+getItem);
        t.setFont("bold 14px Arial");
        t.setColor("rgb(128,128,255)");
        t.setAlign("center");
        moveUnitList.push(t);
       
    }
        
}

//스테이지가 올라갈때 실행되는 함수
var stageUp = function(_x)
{
    //스테이지를 올리고
    //스코어를 올리고
    //벽돌 공을 한칸씩 내리고 새로운 벽돌을 만듬
    //기타 값들 조정
    stage++;
    moveUnitList[0].setText("Score : "+stage);
    brickList.forEach(e => e.downMove());
    itemList.forEach(e => e.downMove());

    for(let i=0;i<itemList.length;i++)
    {
        if(itemList[0].y==420)
        {
            itemList.splice(i,1);
            getItem++;
            break;
        }        
    }

    createStage();
    playerSetting(_x);
    delayShotCount=0;
    remainPlayerBall=getItem;
    moveUnitList[2].setXY(_x, moveUnitList[2].y);
    moveUnitList[2].setText("x"+remainPlayerBall);
}

//플레이어가 공을 쏠떄 실행하는 함수
var playerShot = function()
{
    if(onShot==1)
    {
        if(delayShotCount<=0)
        {
            for(let i=0;i<playerList.length;i++)
            {
                if(playerList[i].readyForShot==0)
                {
                    playerList[i].readyForShot=1;
                    delayShotCount=2;
                    moveUnitList[2].setText("x"+remainPlayerBall);
                    remainPlayerBall-=1;
                    break;
                }
            }
        }
        delayShotCount-=0.18;

        playerList.forEach(e =>e.shot());
    }

    
    
}


//에임(화살표)을 세팅하는 함수
var aimSetting = function(_x,_y)
{
    let a = new Stroke(_x,_y, 3);
    a.setColor("rgb(255,200,30)");
    aimLineList.push(a);

    let b = new Stroke(playerList[0].x, playerList[0].y, 3);
    b.setColor("rgb(128,128,255)");
    aimLineList.push(b);

    let c = new Stroke(playerList[0].x, playerList[0].y, 0);
    c.setColor("rgba(128,128,255,0.5)");
    c.setLineWidth(3);
    aimLineList.push(c);

    let d = new Arrow(playerList[0].x, playerList[0].y);
    d.setColor("rgba(128,128,255,0.5)");
    aimLineList.push(d);

    let e = new Ball(playerList[0].x, playerList[0].y);
    aimLineList.push(e);

}


//자바스크립트 내 좌표는 제 4사분면 (왼쪽위가0,0)
//자바스크립트 내 사인코사인 각도를 재조정
//모든 사인코사인기반 각도설정은 이 함수를 거쳐야함
//결과값은 0도는(→) 180도는(←) 90도는 (↑)
var set360Angle = function(a)
{
    if(a<=0) a*=-1;
    else a = 360-a;
    return a;
}

//모든 각도를 0~360내 범위로 만듬
// -각도면 +360, 360이 넘으면 -360
var setLessThan360Angle = function(a)
{
    while(a<0) a+=360;
    while(a>360) a-=360;
    return a;
}


//콜라이더 각 유닛별 충돌을 관리하는 함수
//충돌처리는 복잡하지만 중요한 개념임 꼭 알아두면 좋음
//수학적인 요소가 많이들어가있음
var collider = function()
{
    //모든 플레이어에 대하여
    for(let i=0;i<playerList.length;i++)
    {
        //간단하게 작성하기 위한 변수설정
        let p = playerList[i];
        let pTop = p.y - p.radius;
        let pBottom = p.y + p.radius;
        let pLeft = p.x - p.radius;
        let pRight = p.x + p.radius;
        
        //플레이어가 양옆 벽에 닿으면 각도를 바꿈. 입사각/반사각
        if (p.x < p.radius || p.x > myCanvas.width - p.radius)
        {
            let n = 180;
            if(p.angle > 180) n+=360; 
            playerList[i].setAngle(n - playerList[i].angle);
        }

        //플레이어가 맨 위 벽에 닿으면 각도를 바꿈.
        if (p.y < upBar + p.radius)
        {
            playerList[i].setAngle(360 - playerList[i].angle);
        }
        //플레이어가 벽돌에 닿으면 튕김
        for(let j=0;j<brickList.length;j++)
        {
            let b = brickList[j];
            let bTop = b.y;
            let bBottom = b.y + b.height;
            let bLeft = b.x;
            let bRight = b.x + b.width;

            //대각으로 맞을 때 처리할 값
            let dLeftTop = Math.pow(Math.pow(p.x - bLeft,2) + Math.pow(p.y - bTop,2), 0.5);
            let dRightTop = Math.pow(Math.pow(p.x - bRight,2) + Math.pow(p.y - bTop,2), 0.5);
            let dLeftBottom = Math.pow(Math.pow(p.x - bLeft,2) + Math.pow(p.y - bBottom,2), 0.5);
            let dRightBottom = Math.pow(Math.pow(p.x - bRight,2) + Math.pow(p.y - bBottom,2), 0.5);

            //벽돌의 어느 변에 맞냐에 따라 튀는 각을 다르게 조정해야 함으로 각각 네 변에 대해서 연산을 수행

            //양옆에 맞을 때
            if(pRight >= bLeft && pLeft <= bRight && p.y >= bTop && p.y <= bBottom)
            {
                brickList[j].hit();
                let n = 180;
                if(p.angle > 180) n+=360; 
                playerList[i].setAngle(n - playerList[i].angle);
            }
            //위아래로 맞을 때
            else if(p.x >= bLeft && p.x <= bRight && pTop <= bBottom && pBottom >= bTop)
            {
                brickList[j].hit();
                playerList[i].setAngle(360 - playerList[i].angle);
            }

            //대각처리
            //d어쩌고는 벽돌의 각 대각선 - 플레이어의 위치좌표
            //즉 대각선 좌표값- 플레이어의 위치좌표 거리보다 플레이어의 반지름이 크면 충돌
            //피타고라스법칙으로 대각선 거리를 구함 
            //a값은 충돌할 때 각도, 이 각도를 기반으로 입사각, 반사각을 구해 각도를 바꿔줌
            else if(dLeftTop <= p.radius)
            {
                brickList[j].hit();

                let a = set360Angle(Math.atan2(p.y-bTop, p.x-bLeft) * 180 / Math.PI);
                let p0 = setLessThan360Angle(playerList[i].angle + 180);
                playerList[i].setAngle(setLessThan360Angle((a*2)-p0));

            }
            else if(dRightTop <= p.radius)
            {
                brickList[j].hit();

                let a = set360Angle(Math.atan2(p.y-bTop, p.x-bRight) * 180 / Math.PI);
                let p0 = setLessThan360Angle(playerList[i].angle + 180);
                playerList[i].setAngle(setLessThan360Angle((a*2)-p0));
            
            }
            else if(dLeftBottom <= p.radius)
            {
                brickList[j].hit();
                
                let a = set360Angle(Math.atan2(p.y-bBottom, p.x-bLeft) * 180 / Math.PI);
                let p0 = setLessThan360Angle(playerList[i].angle + 180);
                playerList[i].setAngle(setLessThan360Angle((a*2)-p0));

            }
            else if(dRightBottom <= p.radius)
            {
                brickList[j].hit();
                
                let a = set360Angle(Math.atan2(p.y-bBottom, p.x-bRight) * 180 / Math.PI);
                let p0 = setLessThan360Angle(playerList[i].angle + 180);
                playerList[i].setAngle(setLessThan360Angle((a*2)-p0));
            }
            

        }
        //플레이어가  아이템과 충돌
        for(let j=0;j<itemList.length;j++)
        {
            let d = Math.pow(Math.pow(p.x - itemList[j].x,2) + Math.pow(p.y - itemList[j].y,2), 0.5);
            if(d < p.radius+itemList[j].radius+8)
            {
                itemList[j].hit();
            }

        }
    }
}


//유닛매니저 모든 유닛리스트를 관리
//각 유닛에 맞는 일을 수행시킴
var unitManager = function()
{
    let playerCount=0;
    

    if(remainPlayerBall==0)
    {
        moveUnitList[2].setText("");
    }

    //블럭리스트에 대하여 죽은 블럭을 삭제
    for(let i=0;i<brickList.length;i++)
    {
        if(brickList[i].isDead==1)
        {
            brickList.splice(i,1);
        }
    }

    //아이템리스트에 대하여 맞은 아이템을 떨굼
    for(let i=0;i<itemList.length;i++)
    {
        if(itemList[i].hp<=0)
        {
            itemList[i].drop();        
        }
    }

    //플레이어리스트에 대하여
    for(let i=0;i<playerList.length;i++)
    {
        //발사되고있는지?
        if(playerList[i].onShooting==1)
        {
            playerCount+=1;   
        }

        //플레이어가 땅에 떨어졌는지, 떨어졌다면 떨어진 처음위치를 기억
        if(playerList[i].onLanding==1 && onFirstLandCheck==0)
        {
            onFirstLandCheck=1;
            if(playerList[i].x - playerList[i].radius<=0)
                firstLandX = playerList[i].radius + 0.1;
            else if(playerList[i].x + playerList[i].radius>=myCanvas.width)
                firstLandX = myCanvas - playerList[i].radius + 0.1;
            else
                firstLandX = playerList[i].x;

        }

        //땅에 떨어지면
        if(playerList[i].onLanding==1)
        {
            if(playerList[i].x > firstLandX)
            {
                playerList[i].x-=4;
            } 
            else if(playerList[i].x < firstLandX)
            {
                playerList[i].x+=4;
            }
            if(Math.abs(playerList[i].x - firstLandX) <= 4)
            {
                playerList[i].x = firstLandX;
            }
        }
    }

    //아이템을 픽업하는 과정을 거칠 지, 안 거칠 지
    if(onShot==1 && playerCount==0 && firstLandX!=-1)
    {
        pickUp=1;
    }
}


//아이템을 주울때 발생하는 함수
var itemPickUp = function()
{
    if(pickUp==1)
    {
        let n=0;
        for(let i=0;i<itemList.length;i++)
        {
            if(itemList[i].hp<=0 && itemList[i].y>=470)
            {
                if(itemList[i].x > firstLandX)
                {
                    itemList[i].x-=2.5;
                }
                else if(itemList[i].x < firstLandX)
                {
                    itemList[i].x+=2.5;
                }
                if(Math.abs(itemList[i].x - firstLandX) <= 3)
                {
                    itemList[i].x = firstLandX;
                    itemList.splice(i,1);
                    i--;
                    getItem++;
                }
            }
        }
        for(let i=0;i<itemList.length;i++)
        {
            if(itemList[i].hp<=0)
            {
                n=1;
            }
        }
        if(itemList.length==0 || n==0)
        {
            onShot=0;
            onFirstLandCheck=0;
            pickUp=0;
            stageUp(firstLandX);
        }
    }
}


//-------------------------------시스템------------------------------

//초기세팅
var setting = function()
{
    unitSetting();
    playerSetting(playerX);
    createStage();
    setNumber();

}
//렌더링
var render = function()
{
    unMoveUnitList.forEach(e=>e.render());
    moveUnitList.forEach(e => e.render());
    itemList.forEach(e => e.render());
    playerList.forEach(e => e.render());
    brickList.forEach(e => e.render());    
    aimLineList.forEach(e => e.render());

}
//업데이트
var update = function()
{
    playerShot();
    collider();
    unitManager();
    itemPickUp();
}
//메인루프
var gameLoop = function()
{
    RTime =Date.now();
    deltaTime =(RTime-LTime)/10000;
    LTime =RTime;
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    update();
    render();
}

//게임오버함수
var gameOver = function(_s)
{
    do
    {
        var name = prompt("Name(less than 3 letters): ");
    } while(name.length==0 || name.length > 4);

    alert(name+"'s Score : "+_s);
    f5=1;
    history.go(0);

}



//-----------------------------이벤트리스너-----------------------------


//마우스가 움직일떄 실행되는 함수
var mouseMoveFunc = function(e)
{
    mouseX = e.clientX-myCanvas.offsetLeft;
    mouseY = e.clientY-myCanvas.offsetLeft;

    if(onMouseClick==1)
    {
        let m = set360Angle(Math.atan2(mouseY-mousePointY, mouseX-mousePointX) * 180 / Math.PI);
        if(m<=8 || m>=270) m = 8;
        else if(m<270 && m>173) m = 173;
        
        let vX=playerList[0].x;
        let vY=playerList[0].y;
        let bX=-1;
        let bY=-1;
        let c=0;
        let r = aimLineList[4].radius;

        let arrowX=playerList[0].x;
        let arrowY=playerList[0].y;

        for(;;)
        {
            vX+=Math.cos(m * Math.PI / 180);
            vY-=Math.sin(m * Math.PI / 180);
            if(c==0)
            {
                for(let i=0;i<brickList.length;i++)
                {
                    let vTop = vY - r;
                    let vBottom = vY + r;
                    let vLeft = vX - r;
                    let vRight = vX + r;

                    let b = brickList[i];
                    let bTop = b.y;
                    let bBottom = b.y + b.height;
                    let bLeft = b.x;
                    let bRight = b.x + b.width;

                    let dLeftTop = Math.pow(Math.pow(vX - bLeft,2) + Math.pow(vY - bTop,2), 0.5);
                    let dRightTop = Math.pow(Math.pow(vX- bRight,2) + Math.pow(vY - bTop,2), 0.5);
                    let dLeftBottom = Math.pow(Math.pow(vX - bLeft,2) + Math.pow(vY - bBottom,2), 0.5);
                    let dRightBottom = Math.pow(Math.pow(vX - bRight,2) + Math.pow(vY - bBottom,2), 0.5);

                    if((vRight >= bLeft && vLeft <= bRight && vBottom >= bTop && vTop <= bBottom) ||
                    dLeftTop <= r || dRightTop <= r || dLeftBottom <= r || dRightBottom <= r)
                    {
                        bX=vX;
                        bY=vY;
                        c=1;
                    }
                }    
            }
            
            if(vX<=0 || vX >=myCanvas.width || vY <= upMarginY || vY >= myCanvas.height - downMarginY) break;
        }

        arrowX+=80 * Math.cos(m * Math.PI / 180);
        arrowY-=80 * Math.sin(m * Math.PI / 180);


        aimLineList[0].setLineTo(mouseX, mouseY);
        aimLineList[1].setLineTo(vX, vY);
        aimLineList[2].setLineTo(arrowX, arrowY);
        aimLineList[3].setLineTo(arrowX, arrowY);
        aimLineList[3].onRender=1;
        aimLineList[3].angle=m;

        if(bX == -1 && bY == -1)
        {
            aimLineList[4].x=vX - r * Math.cos(m * Math.PI / 180);
            aimLineList[4].y=vY + r * Math.sin(m * Math.PI / 180);
        }
        else
        {
            aimLineList[4].x=bX;
            aimLineList[4].y=bY;
        }
        aimLineList[4].onRender=1;

    }


}


//마우스 클릭하면 실행되는 함수
var mouseClickFunc = function(e)
{
    if(onShot==0 && onMouseClick==0)
    {
        mousePointX = mouseX;
        mousePointY = mouseY;
        
        mouseX = e.clientX-myCanvas.offsetLeft;
        mouseY = e.clientY-myCanvas.offsetLeft;
        aimSetting(mousePointX, mousePointY);

        onMouseClick=1;
    }
    
}


//마우스 클릭을 땔때 실행되는 함수 
var mouseUpFunc = function(e)
{

    if(onShot==0)
    {
        let m = set360Angle(Math.atan2(mouseY-mousePointY, mouseX-mousePointX) * 180 / Math.PI);
        if(m<=8 || m>=270) m = 8;
        else if(m<270 && m>173) m = 173;

        playerList.forEach(e=>e.dx=1.8);
        playerList.forEach(e=>e.dy=1.8);
        playerList.forEach(e => e.setAngle(m));
        aimLineList.splice(0,5);
        
        onShot=1;
        onMouseClick=0;
    }
    
}


//키를 누르면 실행되는 함수
var keyDownFunc = function(e)
{
    if(e.code=="F12")
    {
        //e.preventDefault();
        //return false;
    }
}

//자바스크립트 내 리스너 연결
myCanvas.addEventListener("mousemove",mouseMoveFunc,false);
myCanvas.addEventListener("mousedown",mouseClickFunc,false);
myCanvas.addEventListener("mouseup",mouseUpFunc,false);

//우클릭 방지
document.oncontextmenu = function(e)
{
    return false;
}
document.addEventListener("keydown",keyDownFunc,false);

//새로고침 방지
window.onbeforeunload = function(e)
{
    if(f5==0) return 0;
}

//--------------------------실제 동작하는 함수--------------------------
//게임시작 함수

var GAMESTART = function()
{
    //setting()한번실행, gameLoop를 끝까지 실행
    //아두이노 셋업 루프 개념과 똑같음
    //setInterval로 실행 프레임을 조정
    setting();
    setInterval(gameLoop,deltaTime);
}


//시작
GAMESTART();

