export const ColorType = {
    BLUE: 0,
    YELLOW: 1,
    RED: 2,
    GREEN: 3,
}

export const getLightColorByType = (colorType) => {
    switch (colorType) {
        case ColorType.BLUE: return "#00bcd4";
        case ColorType.YELLOW: return "#ffff57";
        case ColorType.RED: return "#a80000";
        case ColorType.GREEN: return "#52804d";
    }
}

export const getDarkColorByType = (colorType) => {
    switch (colorType) {
        case ColorType.BLUE: return "#10495e";
        case ColorType.YELLOW: return "#cd9722";
        case ColorType.RED: return "#641f14";
        case ColorType.GREEN: return "#2f492c";
    }
}

export const getRangeColor = (value) => {
    if (value < 33) {
        return getLightColorByType(ColorType.RED);
    } else if (value < 66) {
        return getLightColorByType(ColorType.YELLOW);
    } else {
        return getLightColorByType(ColorType.GREEN);
    }
}