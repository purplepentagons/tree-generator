class Tree {
    location = { x: 100, y: 100 };
    size = 0;

    constructor(
        children,
        angle = 0, 
    ) {
        this.children = children;
        this.angle = angle;
    }
    
    createStroke(ctx, change) {
        let currX = this.location.x;
        let currY = this.location.y;

        let changeFactor = 1 + Math.pow(1.2, -this.depth - 2)*change/5

        let angle = (this.angle*Math.PI*changeFactor)/180;
    
        let lineX = currX + this.size*Math.cos(angle);
        let lineY = currY - this.size*Math.sin(angle);

        ctx.moveTo(currX, currY);
        ctx.lineTo(lineX, lineY);
        for (let child of this.children) {
            child.location = { x: lineX, y: lineY }
            child.createStroke(ctx, change);
        }
    }

    render(ctx, change) {
        ctx.beginPath();
        ctx.clearRect(0, 0, 1600, 1600);
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1600, 1600);
        
        this.createStroke(ctx, change);
        ctx.stroke();
        ctx.closePath();
    }

    // mutating
    // angleFunction(angle, branchNumber, depth)
    populateWithBranches(depth, angleFunction, childAmountFunction, sizeFunction) {
        if (depth <= 0) {
            return;
        }

        this.depth = depth;

        let childrenAmount = childAmountFunction(depth);

        // creates an array, deconstructs its keys for a count from 
        this.children = Array.from([...Array(childrenAmount).keys()], (n) => {
            let child = Tree.new(angleFunction(this.angle, n, depth));
            child.size = sizeFunction();
            child.populateWithBranches(depth - 1, angleFunction, childAmountFunction, sizeFunction);
            return child;
        })
    }

    static new(angle) {
        let tree = new Tree([],angle);
        return tree;
    }
}