import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const SignatureCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const context = canvas.getContext('2d');
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#000';
      setCtx(context);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoords = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  const startDrawing = (event) => {
    setIsDrawing(true);
    const { x, y } = getCoords(event);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(event);
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.closePath();
  };

  useImperativeHandle(ref, () => ({
    clearSignature: () => {
      const canvas = canvasRef.current;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    isSigned: () => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
  
      const blank = document.createElement("canvas");
      blank.width = canvas.width;
      blank.height = canvas.height;
  
      return canvas.toDataURL() !== blank.toDataURL(); //cek apakah canvaskosong
    },
    toDataURL: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL("image/png") : null;
    }
  }));  

  return (
    <canvas
      ref={canvasRef}
      className='border w-100'
      style={{ touchAction: 'none', backgroundColor: '#ffff', height: '150' }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});

export default SignatureCanvas;