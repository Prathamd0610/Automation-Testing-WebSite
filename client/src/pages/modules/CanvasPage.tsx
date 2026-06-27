import { useEffect, useRef, useState } from 'react';
import { PenTool, Eraser } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Point {
  x: number;
  y: number;
}

const WIDTH = 600;
const HEIGHT = 320;

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [last, setLast] = useState<Point | null>(null);

  // Redraw whenever the points change — canvas has no DOM nodes to assert on,
  // so the readouts below are the automation-friendly surface.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'hsl(214 32% 91%)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Connect the points with a line.
    if (points.length > 1) {
      ctx.strokeStyle = 'hsl(214 85% 52%)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }

    // Draw each point.
    points.forEach((p, i) => {
      ctx.fillStyle = i === points.length - 1 ? 'hsl(214 85% 45%)' : 'hsl(214 85% 60%)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Scale display coords to the canvas's intrinsic pixel grid.
    const x = Math.round(((event.clientX - rect.left) / rect.width) * WIDTH);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * HEIGHT);
    const point = { x, y };
    setPoints((prev) => [...prev, point]);
    setLast(point);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<PenTool className="h-5 w-5" />}
        title="Canvas"
        description="An HTML canvas with no inner DOM — click to plot connected points and assert on the coordinate and count readouts instead of elements."
      />

      <Section title="Plot points" id="canvas" description="Click anywhere on the canvas to drop a point at those coordinates.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              data-testid="draw-canvas"
              onClick={handleClick}
              role="img"
              aria-label="Drawing canvas — click to plot points"
              className="w-full cursor-crosshair rounded-lg border"
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                data-testid="canvas-clear"
                disabled={points.length === 0}
                onClick={() => {
                  setPoints([]);
                  setLast(null);
                }}
              >
                <Eraser className="h-4 w-4" /> Clear
              </Button>
              <span className="text-sm text-muted-foreground" data-testid="canvas-count">
                {points.length} point{points.length === 1 ? '' : 's'}
              </span>
            </div>
          </CardContent>
        </Card>
        <ResultPanel
          label="Last point (x, y)"
          value={last ? `${last.x}, ${last.y}` : null}
          testId="canvas-last-point"
          tone={last ? 'success' : 'default'}
        />
      </Section>
    </PageContainer>
  );
}
