// Simple canvas line chart helper for React

export interface LineChartOptions {
  yLabel?: string;
  lineColor?: string;
}

export function drawLineChart(
  canvasId: string,
  labels: Date[],
  values: number[],
  opts: LineChartOptions = {}
): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Define margins
  const marginLeft = 40;
  const marginBottom = 30;
  const chartWidth = width - marginLeft - 10;
  const chartHeight = height - marginBottom - 10;

  // Draw axes
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(marginLeft, 10);
  ctx.lineTo(marginLeft, 10 + chartHeight);
  ctx.lineTo(marginLeft + chartWidth, 10 + chartHeight);
  ctx.stroke();

  // Scaling
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const yRange = maxVal - minVal || 1;
  const minTime = labels[0].getTime();
  const maxTime = labels[labels.length - 1].getTime();
  const xRange = maxTime - minTime || 1;

  // Grid and labels
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const y = 10 + chartHeight - (chartHeight * i) / ticks;
    const val = (minVal + (yRange * i) / ticks).toFixed(2);
    ctx.fillText(val, 2, y + 4);
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    ctx.moveTo(marginLeft, y);
    ctx.lineTo(marginLeft + chartWidth, y);
    ctx.stroke();
  }

  // X-axis labels
  for (let i = 0; i <= 4; i++) {
    const x = marginLeft + (chartWidth * i) / 4;
    const time = new Date(minTime + (xRange * i) / 4);
    const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.save();
    ctx.translate(x, 10 + chartHeight + 5);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  // Y-axis title
  if (opts.yLabel) {
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText(opts.yLabel, 0, 0);
    ctx.restore();
  }

  // Draw line
  ctx.strokeStyle = opts.lineColor || '#007bff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((val, idx) => {
    const xPos = marginLeft + ((labels[idx].getTime() - minTime) / xRange) * chartWidth;
    const yPos = 10 + chartHeight - ((val - minVal) / yRange) * chartHeight;
    if (idx === 0) {
      ctx.moveTo(xPos, yPos);
    } else {
      ctx.lineTo(xPos, yPos);
    }
  });
  ctx.stroke();
}