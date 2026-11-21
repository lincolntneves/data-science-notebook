'use strict';

const data = Array.from({length: 64}, (_, i) => {
  const x = ((i * 37 + 3) % 67) / 67;
  const y = ((i * 23 + 5) % 71) / 71;
  const score = 1.1 * x + .8 * y + .32 * Math.sin(12 * x);
  return [x, y, Number((score > .99) !== (i % 13 === 0))];
});
const mean = xs => xs.reduce((a,b) => a+b, 0) / xs.length;
const sigmoid = z => 1 / (1 + Math.exp(-z));
const clip = p => Math.max(.0001, Math.min(.9999, p));
const distance = (a,b) => (a[0]-b[0])**2 + (a[1]-b[1])**2;

function gaussian(points, covarianceMode, smoothing) {
  const groups = [0,1].map(label => points.filter(p => p[2] === label));
  const fits = groups.map(rows => {
    const center = [mean(rows.map(p=>p[0])), mean(rows.map(p=>p[1]))];
    const residuals = rows.map(p => [p[0]-center[0],p[1]-center[1]]);
    return {center, n:rows.length, cov:[
      mean(residuals.map(([x])=>x*x)), mean(residuals.map(([,y])=>y*y)),
      mean(residuals.map(([x,y])=>x*y))
    ]};
  });
  const pooled = fits[0].cov.map((a,i) => (a*fits[0].n+fits[1].cov[i]*fits[1].n)/points.length);
  const models = fits.map(({center,n,cov}) => {
    let [a,d,b] = covarianceMode === 'shared' ? pooled : cov;
    a += smoothing;
    d += smoothing;
    if (covarianceMode === 'diagonal') b = 0;
    const det=a*d-b*b;
    return ([u,v]) => {
      const x=u-center[0], y=v-center[1];
      return Math.log(n/points.length) - .5*(Math.log(det)+(d*x*x-2*b*x*y+a*y*y)/det);
    };
  });
  return p => sigmoid(models[1](p)-models[0](p));
}

function linearSvm(points,C) {
  const w = [0,0];
  let b = 0;
  // Batch subgradient descent on half the squared norm plus C times mean hinge loss.
  for (let step=0; step<900; step++) {
    let gx=0,gy=0,gb=0;
    for (const [x,y,label] of points) {
      const sign=2*label-1;
      if (sign*(w[0]*x+w[1]*y+b)<1) {
        gx-=sign*x; gy-=sign*y; gb-=sign;
      }
    }
    const rate=.15/Math.sqrt(1+step);
    w[0]-=rate*(w[0]+C*gx/points.length);
    w[1]-=rate*(w[1]+C*gy/points.length);
    b-=rate*C*gb/points.length;
  }
  return ([x,y]) => w[0]*x+w[1]*y+b;
}

function bestSplit(rows,target,features,loss) {
  let best=null;
  let bestLoss=loss(rows.map(target));
  for (const j of features) {
    const values=[...new Set(rows.map(row=>row[j]))].sort((a,b)=>a-b);
    for (let i=1;i<values.length;i++) {
      const cut=(values[i-1]+values[i])/2;
      const left=rows.filter(row=>row[j]<=cut);
      const right=rows.filter(row=>row[j]>cut);
      const error=loss(left.map(target))+loss(right.map(target));
      if (error<bestLoss-1e-10) {
        bestLoss=error;
        best={j,cut,left,right};
      }
    }
  }
  return best;
}
function randomForest(points,count) {
  let seed=2026;
  function random() {
    seed=(Math.imul(1664525,seed)+1013904223)>>>0;
    return seed/4294967296;
  }
  const label = row => row[2];
  const impurity = ys => {
    const p=mean(ys);
    return ys.length*2*p*(1-p);
  };
  function fit(rows,depth) {
    const score=mean(rows.map(label));
    const split=depth && score>0 && score<1 ? bestSplit(rows,label,[Math.floor(random()*2)],impurity) : null;
    if (!split) return () => score;
    const {j,cut,left,right}=split;
    const low=fit(left,depth-1), high=fit(right,depth-1);
    return p => (p[j]<=cut?low:high)(p);
  }
  const trees=Array.from({length:count},()=>fit(points.map(()=>points[Math.floor(random()*points.length)]),4));
  return p => mean(trees.map(tree=>tree(p)));
}

function gradientBoost(points,count) {
  const prior=clip(mean(points.map(p=>p[2])));
  const base=Math.log(prior/(1-prior));
  let scores=points.map(()=>base);
  const stumps=[];
  const squaredError=ys => {
    const avg=mean(ys);
    return ys.reduce((s,y)=>s+(y-avg)**2,0);
  };
  for (let i=0;i<count;i++) {
    const rows=points.map(([x,y,label],j)=>[x,y,label-sigmoid(scores[j]),j]);
    const residual=p=>p[2];
    const split=bestSplit(rows,residual,[0,1],squaredError);
    if (!split) break;
    const {j,cut,left,right}=split;
    function leaf(items) {
      const denom=items.reduce((sum,p)=>{
        const prob=clip(sigmoid(scores[p[3]]));
        return sum+prob*(1-prob);
      },0);
      return items.reduce((sum,p)=>sum+p[2],0)/denom;
    }
    const low=leaf(left), high=leaf(right);
    const stump=p=>.25*(p[j]<=cut?low:high);
    stumps.push(stump);
    scores=scores.map((z,j)=>z+stump(points[j]));
  }
  return p => sigmoid(stumps.reduce((z,stump)=>z+stump(p),base));
}

function fitClassifier(model,setting) {
  switch (model) {
    case 'knn': return p => mean([...data].sort((a,b)=>distance(a,p)-distance(b,p)).slice(0,setting).map(row=>row[2]));
    case 'nb': return gaussian(data,'diagonal',setting/1000);
    case 'lda': return gaussian(data,'shared',setting/1000);
    case 'qda': return gaussian(data,'separate',setting/1000);
    case 'svm': return linearSvm(data,setting);
    case 'rf': return randomForest(data,setting);
    case 'gb': return gradientBoost(data,setting);
    default: throw new Error('Unknown classifier');
  }
}

if (typeof document !== 'undefined') {
  const lab=document.getElementById('classifier-lab');
  const canvas=lab.querySelector('canvas');
  const ctx=canvas.getContext('2d');
  const model=lab.dataset.model;
  const classifierSetting=lab.querySelector('#setting');
  const x=lab.querySelector('#query-x'), y=lab.querySelector('#query-y');
  const controls=[classifierSetting,x,y];
  const number=new Intl.NumberFormat(document.documentElement.lang,{maximumFractionDigits:2});
  const percent=new Intl.NumberFormat(document.documentElement.lang,{style:'percent',maximumFractionDigits:1});
  const margin=model==='svm';
  const threshold=margin?0:.5;
  const tone=score=>score>=threshold?'#f4d8c4':'#deede5';
  const result=lab.querySelector('#classification-result');
  let predict;
  let fittedSetting;

  function draw() {
    const setting=Number(classifierSetting.value);
    if (setting!==fittedSetting) {
      predict=fitClassifier(model,setting);
      fittedSetting=setting;
    }
    const width=canvas.clientWidth, height=canvas.clientHeight;
    if (!width || !height) return;
    const dpr=window.devicePixelRatio || 1;
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const left=32, top=12, plotW=width-left-14, plotH=height-top-25;
    const px=v=>left+v*plotW, py=v=>top+(1-v)*plotH;
    const cells=30;
    for (let j=0;j<cells;j++) for (let i=0;i<cells;i++) {
      const score=predict([(i+.5)/cells,(j+.5)/cells]);
      ctx.fillStyle=tone(score);
      ctx.fillRect(px(i/cells),py((j+1)/cells),plotW/cells+.35,plotH/cells+.35);
    }
    for (const [u,v,label] of data) {
      ctx.fillStyle=label?'#9b471d':'#205e4e';
      ctx.beginPath();
      if (label) ctx.rect(px(u)-3,py(v)-3,6,6);
      else ctx.arc(px(u),py(v),3,0,2*Math.PI);
      ctx.fill();
    }
    const query=[Number(x.value)/100,Number(y.value)/100];
    const score=predict(query);
    ctx.fillStyle='#fff';
    ctx.strokeStyle='#152824'; ctx.lineWidth=2;
    ctx.beginPath();
    for (const [dx,dy] of [[0,-7],[7,0],[0,7],[-7,0]]) ctx.lineTo(px(query[0])+dx,py(query[1])+dy);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#172b29'; ctx.font='12px system-ui';
    ctx.fillText('x₁ →',width/2,height-3);
    ctx.fillText('x₂ ↑',3,20);
    controls.forEach(control=>{
      const value=control===classifierSetting?Number(control.value):Number(control.value)/100;
      lab.querySelector('[data-output="'+control.id+'"]').textContent=number.format(value);
    });
    const label = !margin && model==='knn' && score===.5 ? lab.dataset.tie : score>=threshold?lab.dataset.late:lab.dataset.ontime;
    result.textContent=label+' · '+lab.dataset.score+' '+(margin?number.format(score):percent.format(score));
  }
  controls.forEach(control=>control.addEventListener('input',draw));
  lab.querySelector('button').addEventListener('click',()=>{
    controls.forEach(control=>{control.value=control.defaultValue;});
    draw();
  });
  new ResizeObserver(draw).observe(canvas);
  draw();
}
