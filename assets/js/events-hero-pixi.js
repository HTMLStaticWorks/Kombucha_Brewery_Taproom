// events-hero-pixi.js
(function () {
    // Only run if canvas container exists
    const canvasContainer = document.getElementById('canvas');
    if (!canvasContainer) return;

    if (typeof PIXI === 'undefined') {
        console.error('PIXI is not loaded!');
        return;
    }

    PIXI.utils.skipHello();

    // Setup Pixi App
    const app = new PIXI.Application({
        autoResize: true,
        resolution: window.devicePixelRatio || 1,
        backgroundColor: 0x0b0f14,
        resizeTo: canvasContainer
    });

    const container = new PIXI.Container();

    let posX = window.innerWidth / 2,
        displacementSprite = null,
        displacementFilter = null,
        bg = null,
        xVelocity = 0;

    function init() {
        canvasContainer.appendChild(app.view);
        app.stage.interactive = true;
        app.stage.addChild(container);

        PIXI.Loader.shared
            .add('displacement', imgDisplacementBase64)
            .add('bg', imgBgBase64)
            .load(setup);
    }

    function resize() {
        if (!bg) return;
        container.removeChildren();

        bg = background({ x: canvasContainer.clientWidth, y: canvasContainer.clientHeight }, new PIXI.Sprite(PIXI.Loader.shared.resources.bg.texture), 'cover');
        container.addChild(bg);
        bg.zIndex = 1;

        bg.filters = [displacementFilter];
    }
    window.addEventListener('resize', resize);

    function setup() {
        posX = app.renderer.width / 2;
        displacementSprite = new PIXI.Sprite(PIXI.Loader.shared.resources.displacement.texture);
        displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

        displacementSprite.anchor.set(0.5);
        displacementSprite.x = app.renderer.width / 2;
        displacementSprite.y = app.renderer.height / 2;

        app.stage.addChild(displacementSprite);
        displacementFilter.scale.x = 0;
        displacementFilter.scale.y = 0;

        bg = background({ x: canvasContainer.clientWidth, y: canvasContainer.clientHeight }, new PIXI.Sprite(PIXI.Loader.shared.resources.bg.texture), 'cover');
        bg.zIndex = 1;
        container.addChild(bg);

        bg.filters = [displacementFilter];

        // Start interaction tracking
        app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);
        loop();
    }

    function onPointerMove(eventData) {
        posX = eventData.data.global.x;
    }

    function loop() {
        requestAnimationFrame(loop);
        xVelocity += (posX - displacementSprite.x) * 0.095;
        displacementSprite.x = xVelocity;

        let disp = Math.floor(posX - displacementSprite.x);
        if (disp < 0) {
            disp = -disp;
        }

        // Map calculations exactly as Codepen logic, keeping it snappy
        let displacementSpriteScale = map(disp, 0, window.innerWidth, 0.1, 1.6),
            displacementFilterScale = map(disp, 0, window.innerWidth, 0, 300); // 300 slightly toned down for web hero, original 500

        displacementSprite.scale.x = displacementSpriteScale;
        displacementFilter.scale.x = displacementFilterScale;
    }

    function map(n, start1, stop1, start2, stop2) {
        var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    function background(bgSize, inputSprite, type, forceSize) {
        var sprite = inputSprite;
        var bgContainer = new PIXI.Container();
        var mask = new PIXI.Graphics().beginFill(0x0b0f14).drawRect(0, 0, bgSize.x, bgSize.y).endFill();
        bgContainer.mask = mask;
        bgContainer.addChild(mask);
        bgContainer.addChild(sprite);

        var sp = { x: sprite.width, y: sprite.height };
        if (forceSize) sp = forceSize;
        var winratio = bgSize.x / bgSize.y;
        var spratio = sp.x / sp.y;
        var scale = 1;
        var pos = new PIXI.Point(0, 0);
        if (type == 'cover' ? (winratio > spratio) : (winratio < spratio)) {
            scale = bgSize.x / sp.x;
            pos.y = -((sp.y * scale) - bgSize.y) / 2;
        } else {
            scale = bgSize.y / sp.y;
            pos.x = -((sp.x * scale) - bgSize.x) / 2;
        }

        sprite.scale = new PIXI.Point(scale, scale);
        sprite.position = pos;

        return bgContainer;
    }

    init();
})();
