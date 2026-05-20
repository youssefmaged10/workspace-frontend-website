/* ProWorkspace – dashboard.js */

const chartData = [
  { day: 'MON', height: 60, color: '#bfdbfe' },
  { day: 'TUE', height: 45, color: '#93c5fd' },
  { day: 'WED', height: 90, color: '#1d4ed8' },
  { day: 'THU', height: 30, color: '#dbeafe' },
];

function buildChart() {
  const chart = document.getElementById('chart');
  if (!chart) return;
  chartData.forEach(d => {
    const day = document.createElement('div');
    day.className = 'chart-day';
    day.innerHTML = `
      <div class="bar-outer">
        <div class="bar" style="height:${d.height}%;background:${d.color}"></div>
      </div>
      <span class="day-label">${d.day}</span>
    `;
    chart.appendChild(day);
  });
}

document.addEventListener('DOMContentLoaded', buildChart);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });
});