
'use strict';
const get = id => document.getElementById(id);
const colors = {ink:'#263b35', muted:'#526660', grid:'#e2e9e5', teal:'#216e61', rust:'#a34428', decision:'#926a2d'};
const format = (n, digits = 0) => n.toLocaleString(document.documentElement.lang, {
  minimumFractionDigits:digits, maximumFractionDigits:digits
});
const pct = p => format(100 * p) + '%';
const initial = {
  linear:{hours:6, angle:35, extra:false, mode:false},
  logistic:{late:20, threshold:50, extra:true},
  tree:{backlog:12, crew:5, depth:2, mode:true}
};
const state = {
  linear:{...initial.linear}, logistic:{...initial.logistic}, tree:{...initial.tree}
};
const copy = {
  linear:{
    title:t('Regressão linear'), question:t('Quantos m² a equipe consegue instalar em um turno?'),
    learn:t('A reta tem uma altura inicial e uma inclinação. O modelo escolhe os dois valores que minimizam a soma dos quadrados dos resíduos, as diferenças entre o que ocorreu e o que a reta previu.'),
    use:t('Para prever uma quantidade quando uma relação aproximadamente linear faz sentido. Aqui, cada hora extra muda a previsão de produção pela mesma quantidade.'),
    watch:t('Um ponto extremo pode puxar a reta. Previsões muito além das horas observadas exigem cuidado.'),
    prompt:t('Lembre de cabeça · O que representa a inclinação?'),
    answer:t('Quanto a previsão de produção, em m², muda quando o tempo de trabalho aumenta em uma hora.')
  },
  logistic:{
    title:t('Regressão logística'), question:t('Qual é a probabilidade de uma tarefa atrasar?'),
    learn:t('O modelo ajusta uma curva em S aos exemplos de tarefas que atrasaram (1) ou ficaram no prazo (0). Durante o treinamento, atribuir probabilidade muito baixa ao que de fato aconteceu recebe uma penalidade maior.'),
    use:t('Para estimar a probabilidade de um evento com dois resultados possíveis. Um limiar transforma a probabilidade em uma decisão, como sinalizar uma tarefa para acompanhamento.'),
    watch:t('Ao baixar o limiar, mais tarefas podem ser sinalizadas. Isso pode ajudar a detectar atrasos e também gerar mais alarmes falsos.'),
    prompt:t('Lembre de cabeça · Mudar o limiar muda a curva?'),
    answer:t('A curva fica igual. Muda o ponto de corte usado para converter a probabilidade em uma decisão.')
  },
  tree:{
    title:t('Árvore de decisão'), question:t('Com quantas pendências e pessoas aumenta o risco de atraso?'),
    learn:t('A árvore testa cortes nas entradas e escolhe, em cada etapa, a divisão que deixa os grupos mais homogêneos. Aqui ela usa a impureza de Gini para medir essa mistura de classes.'),
    use:t('Para ver quais perguntas levam a uma previsão. Uma árvore pode combinar condições, como muitas pendências com uma equipe pequena.'),
    watch:t('Mais níveis permitem captar detalhes, inclusive peculiaridades dos dados de treino. Esse ajuste excessivo se chama overfitting.'),
    prompt:t('Lembre de cabeça · De onde vem a estimativa de uma folha?'),
    answer:t('Da proporção de tarefas atrasadas entre os exemplos de treino que chegaram àquela folha.')
  }
};
const production = [[2,12],[2.6,9],[3.1,18],[3.8,17],[4.4,24],[5,22],[5.6,30],[6.1,25],[6.8,35],[7.3,32],[7.9,38],[8.3,43]];
const delays = [[0,0],[1,0],[4,0],[7,0],[9,1],[11,0],[12,0],[15,1],[17,0],[19,0],[21,1],[23,0],[25,1],[28,1],[30,0],[32,1],[36,1],[39,1]];
const work = [
  [2,2,0],[3,4,0],[3,7,0],[4,3,0],[4,9,0],[5,5,0],[6,8,0],[6,3,1],
  [7,4,0],[7,7,0],[8,2,1],[8,6,0],[9,3,1],[9,7,0],[10,4,1],[10,8,0],
  [11,3,1],[11,7,0],[12,5,1],[12,8,0],[13,2,1],[13,6,1],[13,9,0],[14,4,1],
  [14,8,0],[15,3,1],[15,6,1],[16,5,1],[16,8,1],[17,7,1],[18,9,1],[18,5,0]
];
const mean = (rows, col) => rows.reduce((sum, row) => sum + row[col], 0) / rows.length;
function fitLine(rows){
  const xMean = mean(rows,0);
  const yMean = mean(rows,1);
  const covariance = rows.reduce((sum,[x,y]) => sum + (x-xMean)*(y-yMean),0);
  const variance = rows.reduce((sum,[x]) => sum + (x-xMean)**2,0);
  return {xMean, yMean, slope:covariance/variance};
}
const sigmoid = z => 1/(1+Math.exp(-z));
function fitLogistic(rows){
  let intercept = 0, slope = 0;
  for(let step=0;step<1800;step++){
    let dIntercept=0, dSlope=0;
    for(const [minutes, observed] of rows){
      const x=(minutes-20)/10;
      const error=sigmoid(intercept+slope*x)-observed;
      dIntercept+=error;
      dSlope+=error*x;
    }
    intercept-=.18*dIntercept/rows.length;
    slope-=.18*dSlope/rows.length;
  }
  return { intercept, slope };
}
const logisticFit = fitLogistic(delays);
const probability = minutes => sigmoid(logisticFit.intercept + logisticFit.slope * (minutes - 20) / 10);
function showEquation(values) {
  for (const [name,value] of Object.entries(values)) {
    const element = get('eq-' + name);
    if (element) element.textContent = value;
  }
}
const gini = p => 2*p*(1-p);
function fitTree(rows, remaining){
  const rate=mean(rows,2);
  const node={rate,count:rows.length};
  if(remaining===0 || rate===0 || rate===1) return node;
  let bestGain=1e-10, bestSplit=null;
  for(const feature of [0,1]){
    const values=[...new Set(rows.map(row=>row[feature]))].sort((a,b)=>a-b);
    for(let i=1;i<values.length;i++){
      const cut=(values[i-1]+values[i])/2;
      const left=rows.filter(row=>row[feature]<=cut);
      const right=rows.filter(row=>row[feature]>cut);
      const weighted=(left.length*gini(mean(left,2))+right.length*gini(mean(right,2)))/rows.length;
      const gain=gini(rate)-weighted;
      if(gain>bestGain){
        bestGain=gain;
        bestSplit={feature,cut,left,right};
      }
    }
  }
  if(!bestSplit) return node;
  return {...node,feature:bestSplit.feature,cut:bestSplit.cut,
    left:fitTree(bestSplit.left,remaining-1),right:fitTree(bestSplit.right,remaining-1)};
}
function followTree(node, row){
  const path=[];
  let leaf=node;
  while(leaf.left){
    path.push(leaf);
    leaf=row[leaf.feature]<=leaf.cut?leaf.left:leaf.right;
  }
  return {path,leaf};
}
const treeModels=[1,2,3].map(depth=>fitTree(work,depth));
function drawingSurface(canvas){
  const rect=canvas.getBoundingClientRect();
  const density=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(rect.width*density));
  canvas.height=Math.max(1,Math.round(rect.height*density));
  const ctx=canvas.getContext('2d');
  ctx.setTransform(density,0,0,density,0,0);
  ctx.clearRect(0,0,rect.width,rect.height);
  return {ctx,w:rect.width,h:rect.height};
}
function line(ctx, points, color, width=1, dash=[]){
  ctx.beginPath();
  points.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
  ctx.strokeStyle=color;
  ctx.lineWidth=width;
  ctx.setLineDash(dash);
  ctx.stroke();
  ctx.setLineDash([]);
}
function label(ctx, text, x, y, color=colors.muted, position='center', weight=500, size=12){
  ctx.font=weight+' '+size+'px system-ui, sans-serif';
  ctx.textAlign=position;
  ctx.textBaseline='middle';
  ctx.fillStyle=color;
  ctx.fillText(text,x,y);
}
function mark(ctx,x,y,kind='circle'){
  ctx.beginPath();
  if(kind==='square'){
    ctx.rect(x-4,y-4,8,8);
  }else if(kind==='query'){
    ctx.moveTo(x,y-6);ctx.lineTo(x+6,y);ctx.lineTo(x,y+6);ctx.lineTo(x-6,y);ctx.closePath();
  }else{
    ctx.arc(x,y,4.3,0,2*Math.PI);
  }
  ctx.fillStyle=kind==='square'?colors.rust:kind==='query'?'#fff':colors.teal;
  ctx.fill();
  ctx.strokeStyle=kind==='query'?colors.ink:'#fff';
  ctx.lineWidth=kind==='query'?2:1;
  ctx.stroke();
}
function axes(ctx,w,h,xRange,yRange,xTicks,yTicks,xLabel,yLabel,yText=n=>format(n)){
  const left=55,right=w-18,top=18,bottom=h-47;
  const x=value=>left+(right-left)*(value-xRange[0])/(xRange[1]-xRange[0]);
  const y=value=>bottom-(bottom-top)*(value-yRange[0])/(yRange[1]-yRange[0]);
  for(const t of xTicks){
    line(ctx,[[x(t),top],[x(t),bottom]],colors.grid);
    label(ctx,format(t),x(t),bottom+14);
  }
  for(const t of yTicks){
    line(ctx,[[left,y(t)],[right,y(t)]],colors.grid);
    label(ctx,yText(t),left-8,y(t),colors.muted,'right');
  }
  line(ctx,[[left,top],[left,bottom],[right,bottom]],'#9eafa8');
  label(ctx,xLabel,(left+right)/2,h-12,colors.ink);
  ctx.save();
  ctx.translate(13,(top+bottom)/2);
  ctx.rotate(-Math.PI/2);
  label(ctx,yLabel,0,0,colors.ink);
  ctx.restore();
  return {x,y,left,right,top,bottom};
}
function drawLinear(ctx,w,h,s,fit,rows){
  const {x,y,bottom}=axes(ctx,w,h,[0,9],[0,80],[0,2,4,6,8],[0,20,40,60,80],t('Horas trabalhadas'),t('Drywall instalado (m²)'));
  const predict=hours=>fit.yMean+fit.slope*(hours-fit.xMean);
  for(const [hours,area] of rows){
    line(ctx,[[x(hours),y(area)],[x(hours),y(predict(hours))]],'#a6bcb4',1,[4,3]);
  }
  const first=Math.max(0,fit.xMean-fit.yMean/fit.slope);
  line(ctx,[[x(first),y(predict(first))],[x(9),y(predict(9))]],colors.teal,2.5);
  for(const [hours,area] of rows) mark(ctx,x(hours),y(area),area===75?'square':'circle');
  line(ctx,[[x(s.hours),bottom],[x(s.hours),y(predict(s.hours))]],colors.ink,1,[4,3]);
  mark(ctx,x(s.hours),y(predict(s.hours)),'query');
}
function drawLoss(ctx,w,h,s,fit,rows){
  const angle=s.angle*Math.PI/180;
  const cs=Math.cos(angle), sn=Math.sin(angle);
  const span=Math.min(w*.26,h*.50);
  const error=(slope,height)=>mean(rows.map(([x,y])=>[(y-height-slope*(x-fit.xMean))**2]),0);
  const minimum=error(fit.slope,fit.yMean);
  const peak=Math.max(...[-1,1].flatMap(u=>[-1,1].map(v=>error(fit.slope+4*u,fit.yMean+11*v))));
  function project(u,v,z){
    return [w*.50+span*(u*cs-v*sn),h*.59+span*.28*(u*sn+v*cs)-span*.66*z];
  }
  const z=(u,v)=>(error(fit.slope+4*u,fit.yMean+11*v)-minimum)/(peak-minimum);
  const N=15;
  const cells=[];
  for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
      const u=2*i/N-1,v=2*j/N-1,d=2/N;
      const corners=[[u,v],[u+d,v],[u+d,v+d],[u,v+d]];
      cells.push({corners,depth:(u+d/2)*sn+(v+d/2)*cs,level:z(u+d/2,v+d/2)});
    }
  }
  cells.sort((a,b)=>a.depth-b.depth);
  for(const cell of cells){
    const points=cell.corners.map(([u,v])=>project(u,v,z(u,v)));
    ctx.beginPath();
    points.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.closePath();
    ctx.fillStyle='hsl('+ (154 - 105*cell.level) +' 39% '+(83-25*cell.level)+'%)';
    ctx.fill();
    ctx.strokeStyle='#427c6b80';ctx.lineWidth=.6;ctx.stroke();
  }
  const [bestX,bestY]=project(0,0,0);
  mark(ctx,bestX,bestY,'query');
  label(ctx,t('Menor erro'),bestX,bestY-14,colors.ink,'center',700);
  label(ctx,t('Inclinação × altura da reta'),w/2,h-29,colors.ink);
  label(ctx,t('Altura da superfície = erro quadrático médio'),w/2,h-11,colors.muted,'center',500,11);
}
function drawLogistic(ctx,w,h,s){
  const {x,y,left,right,bottom}=axes(ctx,w,h,[0,40],[0,1],[0,10,20,30,40],[0,.25,.5,.75,1],
    w<430?t('Atraso da entrega (min)'):t('Minutos de atraso na entrega de material'),t('Probabilidade de atraso'),pct);
  const series=Array.from({length:101},(_,i)=>i*.4);
  line(ctx,series.map(minutes=>[x(minutes),y(probability(minutes))]),colors.teal,2.6);
  if(s.extra){
    line(ctx,[[left,y(s.threshold/100)],[right,y(s.threshold/100)]],colors.decision,1.6,[6,4]);
  }
  for(const [minutes,outcome] of delays) mark(ctx,x(minutes),y(outcome),outcome?'square':'circle');
  line(ctx,[[x(s.late),bottom],[x(s.late),y(probability(s.late))]],colors.ink,1,[4,3]);
  mark(ctx,x(s.late),y(probability(s.late)),'query');
}
function treeRegions(node,bounds,regions){
  if(!node.left){
    regions.push({...bounds,rate:node.rate});
    return;
  }
  const cut=node.cut;
  if(node.feature===0){
    treeRegions(node.left,{...bounds,xHigh:cut},regions);
    treeRegions(node.right,{...bounds,xLow:cut},regions);
  }else{
    treeRegions(node.left,{...bounds,yHigh:cut},regions);
    treeRegions(node.right,{...bounds,yLow:cut},regions);
  }
}
function drawRegions(ctx,w,h,s,tree){
  const {x,y}=axes(ctx,w,h,[0,20],[1,10],[0,5,10,15,20],[2,4,6,8,10],t('Pendências no início do turno'),t('Pessoas na equipe'));
  const regions=[];
  treeRegions(tree,{xLow:0,xHigh:20,yLow:1,yHigh:10},regions);
  for(const r of regions){
    const left=x(r.xLow),top=y(r.yHigh),width=x(r.xHigh)-left,height=y(r.yLow)-top;
    ctx.fillStyle=r.rate>.5?'#f7ddd2cc':'#daeee4cc';
    ctx.fillRect(left,top,width,height);
    ctx.strokeStyle='#7a9186';ctx.lineWidth=1;ctx.strokeRect(left,top,width,height);
  }
  for(const [backlog,crew,outcome] of work) mark(ctx,x(backlog),y(crew),outcome?'square':'circle');
  mark(ctx,x(s.backlog),y(s.crew),'query');
}
function drawTree(ctx,w,h,s,tree){
  const {path,leaf}=followTree(tree,[s.backlog,s.crew]);
  function countLeaves(node){
    return node.left?countLeaves(node.left)+countLeaves(node.right):1;
  }
  const leaves=countLeaves(tree);
  const width=w/leaves;
  const boxWidth=Math.min(width-6,144);
  const size=width<66?9:width<95?10:12;
  const step=(h-67)/s.depth;
  const items=[];
  function place(node,start,end,level,parent,side){
    const item={node,x:(start+end)*width/2,y:29+level*step,side,parent};
    items.push(item);
    if(node.left){
      const divider=start+countLeaves(node.left);
      place(node.left,start,divider,level+1,item,t('Sim'));
      place(node.right,divider,end,level+1,item,t('Não'));
    }
  }
  place(tree,0,leaves,0,null,'');
  for(const {node,x,y,side,parent} of items){
    if(!parent) continue;
    const active=path.includes(node)||node===leaf;
    line(ctx,[[parent.x,parent.y+19],[x,y-19]],active?colors.teal:'#bac8c1',active?2.4:1);
    if(width>=55) label(ctx,side,(parent.x+x)/2,(parent.y+y)/2-5,active?colors.teal:colors.muted,'center',700,10);
  }
  for(const {node,x,y} of items){
    const active=path.includes(node)||node===leaf;
    ctx.fillStyle=node.left?(active?'#e6f2ec':'#f7faf8'):(node.rate>.5?'#f7ddd2':'#daeee4');
    ctx.strokeStyle=active?colors.teal:'#c8d4ce';
    ctx.lineWidth=active?2:1;
    ctx.beginPath();
    ctx.roundRect(x-boxWidth/2,y-19,boxWidth,38,6);
    ctx.fill();ctx.stroke();
    const name=node.feature===0?(width<90?t('Pend.'):t('Pendências')):(width<90?t('Equipe'):t('Pessoas'));
    const first=node.left?name+' ≤ '+format(node.cut,node.cut%1?1:0):pct(node.rate)+(width<76?'':t(' atraso'));
    label(ctx,first,x,y-5,colors.ink,'center',700,size);
    label(ctx,'n = '+node.count,x,y+9,colors.muted,'center',500,10);
  }
}
const sliders = {
  hours:[t('Duração do turno'),2,9,.5,v=>format(v,v%1?1:0)+' h'],
  angle:[t('Girar superfície'),0,360,5,v=>v+'°'],
  late:[t('Atraso na entrega de material'),0,40,1,v=>v+' min'],
  threshold:[t('Limiar para sinalizar'),5,95,1,v=>v+'%'],
  backlog:[t('Pendências no início do turno'),0,20,1,v=>v],
  crew:[t('Pessoas na equipe'),1,10,1,v=>v],
  depth:[t('Profundidade máxima'),1,3,1,v=>v],
};

function showSliders(){
  const s=state[active];
  const keys=active==='linear'?['hours',...(s.mode?['angle']:[])]:
    active==='logistic'?['late','threshold']:['backlog','crew','depth'];
  get('sliders').replaceChildren();
  for(const key of keys){
    const [title,min,max,step,display]=sliders[key];
    const item=document.createElement('div');
    item.style.marginBottom='8px';
    const label=document.createElement('label');
    label.className='slider-label';
    label.htmlFor='slider-'+key;
    const titleNode=document.createElement('span');
    titleNode.textContent=title;
    const value=document.createElement('output');
    value.htmlFor=label.htmlFor;
    value.textContent=display(s[key]);
    label.append(titleNode,value);
    const input=document.createElement('input');
    input.id=label.htmlFor;
    input.type='range';
    input.min=min;input.max=max;input.step=step;input.value=s[key];
    input.setAttribute('aria-valuetext',display(s[key]));
    input.addEventListener('input',()=>{
      s[key]=Number(input.value);
      value.textContent=display(s[key]);
      input.setAttribute('aria-valuetext',display(s[key]));
      refresh();
    });
    item.append(label,input);
    get('sliders').append(item);
  }
}
function showResult(labelText,value,detail){
  const result=get('result');
  if(result.dataset.current===labelText+'|'+value+'|'+detail) return;
  result.dataset.current=labelText+'|'+value+'|'+detail;
  const strong=document.createElement('strong');
  strong.textContent=value;
  const small=document.createElement('small');
  small.textContent=detail;
  result.replaceChildren(document.createTextNode(labelText),strong,small);
}
function legend(items){
  get('legend').replaceChildren(...items.map(([style,title])=>{
    const item=document.createElement('span');
    const key=document.createElement('i');
    key.className='key '+style;
    key.setAttribute('aria-hidden','true');
    item.append(key,document.createTextNode(title));
    return item;
  }));
}
function refresh(){
  const s=state[active];
  const {ctx,w,h}=drawingSurface(get('chart'));
  const toggle=get('mode-toggle');
  const extra=get('extra');
  toggle.hidden=active==='logistic';
  toggle.setAttribute('aria-pressed',Boolean(s.mode));
  get('check-label').parentElement.hidden=active==='tree';
  extra.checked=Boolean(s.extra);
  if(active==='linear'){
    toggle.textContent=t('Superfície 3D');
    get('chart-title').textContent=s.mode?t('O erro para cada combinação de parâmetros'):t('Produção observada e reta ajustada');
    get('check-text').textContent=t('Incluir um ponto extremo');
    get('check-hint').textContent=t('Acrescenta um turno de 8,7 h com 75 m² instalados e recalcula a reta.');
    const rows=s.extra?[...production,[8.7,75]]:production;
    const fit=fitLine(rows);
    const estimate=fit.yMean+fit.slope*(s.hours-fit.xMean);
    const intercept = fit.yMean-fit.slope*fit.xMean;
    showEquation({x:format(s.hours,1)+' h',intercept:format(intercept,2)+' m²',
      slope:format(fit.slope,2)+' m²/h',y:format(estimate,2)+' m²',
      mse:format(mean(rows.map(([x,y])=>[(y-fit.yMean-fit.slope*(x-fit.xMean))**2]),0),2)+' m⁴'});
    if(s.mode){
      drawLoss(ctx,w,h,s,fit,rows);
      legend([['query',t('Ajuste de menor erro')]]);
      get('chart-note').textContent=t('Gire a superfície para ver o vale. Cada ponto combina uma inclinação com a altura da reta na duração média dos turnos. No fundo está o ajuste escolhido.');
    }else{
      drawLinear(ctx,w,h,s,fit,rows);
      legend([['circle',t('Produção observada')],...(s.extra?[['square',t('Ponto extremo')]]:[]),['line',t('Reta ajustada')],['query',t('Sua previsão')]]);
      get('chart-note').textContent=t('Os traços verticais mostram os resíduos. Ative o ponto extremo e compare quanto a inclinação e sua previsão mudam.');
    }
    showResult(t('Produção prevista'),format(estimate,1)+' m²',t('Inclinação da reta: ')+format(fit.slope,1)+t(' m² por hora adicional.'));
  }else if(active==='logistic'){
    get('chart-title').textContent=t('Probabilidade estimada e ponto de corte');
    get('check-text').textContent=t('Mostrar a linha do limiar');
    get('check-hint').textContent=t('A decisão usa o limiar mesmo quando a linha está oculta.');
    const estimate=probability(s.late);
    const x=(s.late-20)/10;
    const z=logisticFit.intercept+logisticFit.slope*x;
    showEquation({x:format(x,2),intercept:format(logisticFit.intercept,2),
      slope:format(logisticFit.slope,2),z:format(z,2),p:format(100*estimate,1)+'%',
      odds:format(Math.exp(z),2)+t(' para 1'),cut:format(s.threshold)+'%'});
    drawLogistic(ctx,w,h,s);
    legend([['circle',t('No prazo (0)')],['square',t('Atrasou (1)')],['line',t('Probabilidade ajustada')],['query',t('Sua tarefa')]]);
    get('chart-note').textContent=t('Compare os pontos observados nos extremos com a curva. Mova o limiar para ver a decisão mudar enquanto a curva fica no mesmo lugar.');
    showResult(t('Probabilidade estimada'),format(100*estimate,1)+'%',estimate>=s.threshold/100?
      t('Sinalizar atraso pelo limiar de ')+s.threshold+'%.':t('Abaixo do limiar de ')+s.threshold+'%.');
  }else{
    const tree=treeModels[s.depth-1];
    const {path,leaf}=followTree(tree,[s.backlog,s.crew]);
    const weighted=(tree.left.count*gini(tree.left.rate)+tree.right.count*gini(tree.right.rate))/tree.count;
    showEquation({p:pct(leaf.rate),n:leaf.count,delay:Math.round(leaf.rate*leaf.count),
      parent:format(gini(tree.rate),3),children:format(weighted,3),
      gain:format(gini(tree.rate)-weighted,3),root:(tree.feature===0?t('Pendências'):t('Pessoas'))+' ≤ '+format(tree.cut,1)});
    toggle.textContent=t('Ver árvore');
    get('chart-title').textContent=s.mode?t('Perguntas e caminho da previsão'):t('Regiões que compartilham a mesma previsão');
    if(s.mode){
      drawTree(ctx,w,h,s,tree);
      legend([]);
      get('chart-note').textContent=t('O caminho verde mostra as perguntas da sua previsão. A porcentagem é a parcela de atrasos na folha. Em cada caixa, n indica quantos exemplos chegaram até ali.');
    }else{
      drawRegions(ctx,w,h,s,tree);
      legend([['circle',t('No prazo')],['square',t('Atrasou')],['query',t('Sua tarefa')]]);
      get('chart-note').textContent=t('Cada retângulo representa uma folha. O fundo salmão indica maioria de atrasos entre os exemplos daquela região. Aumente a profundidade para ver os novos cortes.');
    }
    const decision=leaf.rate>.5?t('Classe: atraso.'):leaf.rate<.5?t('Classe: no prazo.'):t('Empate entre classes na folha.');
    const conditions=path.map(node=>{
      const value=node.feature===0?s.backlog:s.crew;
      return (node.feature===0?t('Pendências'):t('Pessoas'))+(value<=node.cut?' ≤ ':' > ')+format(node.cut,node.cut%1?1:0);
    });
    showResult(t('Atraso estimado na folha'),pct(leaf.rate),decision+' '+Math.round(leaf.rate*leaf.count)+t(' de ')+leaf.count+t(' exemplos atrasaram. ')+conditions.join(' → '));
  }
}

const active = document.body.dataset.model;
const content = copy[active];
get('model-title').textContent = t('Laboratório');
get('model-question').textContent = content.question;
for (const name of ['learn','use','watch','prompt','answer']) get(name).textContent = content[name];

get('reset').addEventListener('click',()=>{
  state[active]={...initial[active]};
  showSliders();
  refresh();
});
get('extra').addEventListener('change',event=>{
  state[active].extra=event.target.checked;
  refresh();
});
get('mode-toggle').addEventListener('click',()=>{
  state[active].mode=!state[active].mode;
  if(active==='linear') showSliders();
  refresh();
});
showSliders();
refresh();
new ResizeObserver(refresh).observe(get('chart'));

const noteKey='caderno-estudos-notas-v2-'+active;
const notes=get('notes');
function noteStatus(message){get('notes-status').textContent=message;}
try{
  notes.value=localStorage.getItem(noteKey)||'';
  noteStatus(t('As notas ficam neste navegador.'));
}catch{
  noteStatus(t('Use a opção de baixar para guardar suas notas.'));
}
notes.addEventListener('input',()=>{
  try{
    localStorage.setItem(noteKey,notes.value);
    noteStatus(t('Notas salvas neste navegador.'));
  }catch{
    noteStatus(t('Use a opção de baixar para guardar suas notas.'));
  }
});
get('export-notes').addEventListener('click',()=>{
  const file=new Blob([content.title+' · Data Science Notebook\n\n'+notes.value],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(file);
  const link=document.createElement('a');
  link.href=url;
  link.download=location.pathname.split('/').pop().replace('.html','')+'-notes.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
