
export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vec2): Vec2 {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    mul(vec: Vec2): Vec2 {
        return new Vec2(this.x * vec.x, this.y * vec.y);
    }
}

class Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    dot(vec: Vec4): number {
        return (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z) + (this.w * vec.w)
    }

    mul(num: number): Vec4 {
        return new Vec4(this.x * num, this.y * num, this.z * num, this.w * num);
    }

    sub(num: number): Vec4 {
        return new Vec4(this.x - num, this.y - num, this.z - num, this.w - num);
    }
}

export class Particle {
    pos: Vec2;
    size: number;
    angle: number;
    shouldSense: boolean;

    constructor(pos: Vec2, angle?: number) {
        this.pos = pos;
        this.size = 1;
        if (angle) {
            this.angle = angle;
        } else {
            this.angle = 0;
        }
        this.shouldSense = false;
    }

    render(ctx: CanvasRenderingContext2D) {
        // ctx.globalAlpha = 0.5;
        // ctx.fillStyle = "#2ee3ff";
        // ctx.globalCompositeOperation = "destination-out";
        let imageData = ctx.createImageData(this.size, this.size);
        let data = imageData.data;
        for (let i = 0; i < data.length; i+= 4) {
            data[i] = 47;
            data[i + 1] = 227;
            data[i + 2] = 255;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, this.pos.x, this.pos.y);

        // ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        // ctx.globalCompositeOperation = "source-over";
        // ctx.globalAlpha = 1;
    }

    sense(ctx: CanvasRenderingContext2D, width: number, height: number, angleOffset: number): number {
        let sum = 0;

        let sensorAngle = this.angle + angleOffset;
        let sensorDirection = new Vec2(Math.cos(sensorAngle), Math.sin(sensorAngle));
        let sensorCenter = this.pos.add(sensorDirection.mul(new Vec2(8,8)));

        for (let xOffset = -1.0; xOffset <= 1.0; xOffset++) {
            for (let yOffset = -1.0; yOffset <= 1.0; yOffset++) {
                let pos = sensorCenter.add(new Vec2(xOffset, yOffset));
                if (pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y < height) {
                    let pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
                    let pixelVec = new Vec4(pixel[0], pixel[1], pixel[2], pixel[3]);
                    let mask = new Vec4(1.0, 1.0, 1.0, 1.0);
                    sum += pixelVec.dot(mask.mul(2).sub(1));
                }
            }
        }
        return sum;
    }

    update(ctx: CanvasRenderingContext2D, width: number, height: number) {
        if (this.shouldSense) {
            let forwardWeight = this.sense(ctx, width, height, 0);
            let leftWeight = this.sense(ctx, width, height, 1);
            let rightWeight = this.sense(ctx, width, height, -1);

            let steerStrength = Math.random();

            if (forwardWeight > leftWeight && forwardWeight > rightWeight) {
                this.angle = this.angle;
            } else if (forwardWeight < leftWeight && forwardWeight < rightWeight) {
                this.angle += (steerStrength - 0.5) * 2 * 1.0;
            } else if (rightWeight > leftWeight) {
                this.angle -= steerStrength * 1.0;
            } else if (leftWeight > rightWeight) {
                this.angle += steerStrength * 1.0;
            }
        }

        let direction = new Vec2(Math.cos(this.angle), Math.sin(this.angle));
        let newPos = this.pos.add(new Vec2(1, 1).mul(direction));

        if (newPos.x < 0 || newPos.x >= width || newPos.y < 0 || newPos.y >= height) {
            newPos.x = Math.min(width - this.size, Math.max(0, newPos.x));
            newPos.y = Math.min(height - this.size, Math.max(0, newPos.y));
            this.angle = Math.floor(Math.random() * 360);
        }
        this.pos = newPos;
    }
}
