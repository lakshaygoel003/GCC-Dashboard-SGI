const ctx = document.getElementById('budgetChart').getContext('2d');

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({length:12}, (_,i)=>"M"+(i+1)),
    datasets: [{
      label: 'Budget (₹ Lakhs)',
      data: [],
      borderColor: '#00ffb4',
      tension: 0.3
    }]
  }
});

const gaugeText = {
  id: 'gaugeText',
  afterDraw(chart) {
    const {ctx} = chart;
    ctx.save();
    let val = Math.round(chart.data.datasets[0].data[0]);
    ctx.font = "bold 18px Inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(val+"%", chart.width/2, chart.height/1.3);
  }
};

const gaugeCtx = document.getElementById('gaugeChart').getContext('2d');

let gauge = new Chart(gaugeCtx, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [50,50],
      backgroundColor: ['#00ffb4','#1e293b'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270
    }]
  },
  options: {
    cutout: '80%',
    plugins: { legend: { display:false } }
  },
  plugins: [gaugeText]
});

function bindSlider(id){
  let el = document.getElementById(id);
  let val = document.getElementById(id+"Val");

  el.addEventListener("input",()=>{
    val.innerText = el.value;
    calculate();
  });
}

["branding","comp","vip","campus","perks"].forEach(bindSlider);

document.getElementById("curve").addEventListener("change", calculate);
document.getElementById("market").addEventListener("change", calculate);

function calculate(){

  let b = branding.value/100;
  let c = comp.value/100;
  let v = vip.value/100;
  let ca = campus.value/100;
  let p = perks.value/100;

  let offer = 35 + b*20 + c*25 + v*15;

  let market = document.getElementById("market").value;
  if (market==="easy") offer += 10;
  if (market==="hard") offer -= 10;

  let awareness = 40 + b*40;
  let engagement = 30 + ca*30 + b*20;
  let conversion = 20 + ca*20 + v*10;

  let brandIndex =
    0.35*offer +
    0.25*awareness +
    0.2*engagement +
    0.2*conversion;

  let totalCost =
    115 + b*40 + v*30 + ca*35 + p*80;

  let cph = (totalCost*100000)/1200;

  document.getElementById("brandIndex").innerText = Math.round(brandIndex)+"%";
  document.getElementById("cph").innerText = "₹"+Math.round(cph);
  document.getElementById("offerRate").innerText = Math.round(offer)+"%";

  let color = "#ff4d4d";
  if (brandIndex>60) color="#facc15";
  if (brandIndex>75) color="#00ffb4";

  gauge.data.datasets[0].data = [brandIndex,100-brandIndex];
  gauge.data.datasets[0].backgroundColor = [color,"#1e293b"];
  gauge.update();

  let curve = document.getElementById("curve").value;
  let data=[];

  for(let i=1;i<=12;i++){
    let x=i/12;
    if(curve==="linear") data.push(totalCost*x);
    if(curve==="front") data.push(totalCost*Math.pow(x,0.7));
    if(curve==="back") data.push(totalCost*Math.pow(x,1.5));
  }

  chart.data.datasets[0].data = data;
  chart.update();
}

calculate();