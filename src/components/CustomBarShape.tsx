import React from 'react';
import { Rectangle, RectangleProps } from 'recharts';

const CustomBarShape: React.FC<RectangleProps> = (props) => {
    const { fill, x, y, width, height } = props;

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            radius={[4, 4, 0, 0]}
        />
    );
};

export default CustomBarShape;
