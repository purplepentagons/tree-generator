addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    globalThis.ctx = canvas.getContext("2d");
    
    ctx.strokeStyle = "green";
    ctx.lineCap = "round";
    ctx.lineWidth = 3;

    globalThis.populate = () => {
        globalThis.tree = Tree.new();
        tree.children = [];
        tree.location = { x: 800, y: 1500 };
        let depth = settings.treeDepth;

        tree.angle = 90;
        tree.populateWithBranches(depth, angleFunction, childAmountFunction, sizeFunction);
    }
    
    populate();

    globalThis.time = 0;
    setInterval(() => {
        time++;
        tree.render(ctx, Math.sin((time*settings.rotationSpeed*Math.PI/20))*settings.rotationScale + 2)
    }, 50)
})