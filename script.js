const gaugeText = {
  id: 'gaugeText',
  afterDraw(chart) {
    const {ctx} = chart;
    ctx.save();

    let val = Math.round(chart.data.datasets[0].data[0]);

    ctx.font = "bold 22px Inter";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(val + "%", chart.width/2, chart.height/1.3);

    ctx.restore();
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

// bind sliders
function bindSlider(id){
  let el = document.getElementById(id);
  let val = document.getElementById(id+"Val");

  el.addEventListener("input",()=>{
    val.innerText = el.value;
    calculate();
  });
}

["branding","campus","vip","engagement"].forEach(bindSlider);

function calculate(){

  let b = branding.value/100;
  let c = campus.value/100;
  let v = vip.value/100;
  let e = engagement.value/100;

  // Brand model
  let awareness = 30 + b*50;
  let engagementScore = 30 + e*50;
  let conversion = 20 + c*40 + v*20;

  let brandIndex =
    0.4*awareness +
    0.3*engagementScore +
    0.3*conversion;

  // update UI
  document.getElementById("brandIndex").innerText =
    Math.round(brandIndex) + "%";

  // color logic
  let color = "#ff4d4d";
  if (brandIndex > 60) color = "#facc15";
  if (brandIndex > 75) color = "#00ffb4";

  gauge.data.datasets[0].data = [brandIndex, 100-brandIndex];
  gauge.data.datasets[0].backgroundColor = [color, "#1e293b"];
  gauge.update();
}

calculate();
