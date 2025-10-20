import React, { useEffect, useRef } from 'react';

export function UiCoverGraphInterlace() {
    const $ref = useRef<HTMLCanvasElement>(null);
    useEffect(
        () => interlace($ref), []
    );
    return <div className='interlace cover-layer'>
        <canvas ref={$ref} />
    </div>;
}
function interlace(
    $ref: React.RefObject<HTMLCanvasElement | null>
) {
    const $canvas = $ref.current;
    if ($canvas === null) {
        return;
    }
    const $context = $canvas.getContext('2d') as CanvasRenderingContext2D;
    for (let h = 0; h < $canvas.height; h += 3) {
        $context.beginPath();
        $context.moveTo(0, h);
        $context.lineTo($canvas.width, h);
        $context.lineWidth = 1;
        $context.stroke();
    }
    return () => $context.clearRect(
        0, 0, $canvas.width, $canvas.height
    );
}
export default UiCoverGraphInterlace;
