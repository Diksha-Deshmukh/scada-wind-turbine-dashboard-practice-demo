interface ChartOptions {
  yLabel?: string;
  lineColor?: string;
}

export function drawLineChart(
  canvasId: string,
  labels: Date[],
  values: number[],
  options: ChartOptions = {}
): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas || values.length === 0) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const minTime = labels[0].getTime();
  const maxTime = labels[labels.length - 1].getTime();
  const timeRange = maxTime - minTime || 1;

  ctx.font = '11px Segoe UI';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + chartHeight - (chartHeight * i) / 4;
    const value = minValue + (valueRange * i) / 4;

    ctx.strokeStyle = '#5c6475';
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(paddingLeft + chartWidth, y);
    ctx.stroke();

    ctx.fillStyle = '#8f98aa';
    ctx.fillText(value.toFixed(2), 8, y + 4);
  }

  ctx.strokeStyle = '#8f98aa';
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartHeight);
  ctx.lineTo(paddingLeft + chartWidth, paddingTop + chartHeight);
  ctx.stroke();

  ctx.fillStyle = '#8f98aa';

  for (let i = 0; i <= 4; i++) {
    const x = paddingLeft + (chartWidth * i) / 4;
    const time = new Date(minTime + (timeRange * i) / 4);
    const label = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    ctx.save();
    ctx.translate(x, height - 12);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  ctx.strokeStyle = options.lineColor || '#1e88ff';
  ctx.lineWidth = 3;
  ctx.beginPath();

  values.forEach((value, index) => {
    const x =
      paddingLeft +
      ((labels[index].getTime() - minTime) / timeRange) * chartWidth;

    const y =
      paddingTop +
      chartHeight -
      ((value - minValue) / valueRange) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}