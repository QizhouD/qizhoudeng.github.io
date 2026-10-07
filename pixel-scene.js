/* Decorative CSS 3D diorama. No WebGL, external libraries, assets or render loop. */
(() => {
    const scene = document.querySelector('.pixel-scene');
    const world = scene?.querySelector('.voxel-world');
    if (!world) return;
    const palettes = {
        stone: ['#ecebd6', '#c5cbb3', '#dbdec5'],
        sage: ['#c5dcb7', '#8caf91', '#a7c89e'],
        mint: ['#a9cfc0', '#74a79a', '#8ebfaf'],
        teal: ['#68c6b7', '#368e89', '#4da99e'],
        coral: ['#f68d70', '#bb6154', '#da7660'],
        paper: ['#fff6dd', '#cbbfa4', '#e6d7b8']
    };
    const fragment = document.createDocumentFragment();
    function voxel(x, y, z, size, height, palette, extraClass = '') {
        const block = document.createElement('div');
        block.className = `voxel ${extraClass}`;
        const values = {x, y, z, size, height};
        for (const [key, value] of Object.entries(values)) block.style.setProperty(`--${key}`, `${value}px`);
        ['top', 'front', 'side', 'back', 'left'].forEach((face, index) => {
            block.style.setProperty(`--${face}`, palettes[palette][[0, 1, 2, 1, 2][index]]);
            const plane = document.createElement('span');
            plane.className = `voxel-${face}`;
            block.append(plane);
        });
        fragment.append(block);
        return block;
    }
    voxel(0, 0, 0, 252, 16, 'stone');
    const route = new Set(['1,6','2,6','3,6','4,6','4,5','4,4','5,4','6,4','7,4','7,3','7,2']);
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            const onRoute = route.has(`${x},${y}`);
            const hill = !onRoute && ((x < 3 && y < 3) || (x > 5 && y > 5));
            const height = onRoute ? 5 : hill ? 12 + ((x + y) % 3) * 8 : 4 + ((x * 3 + y * 5) % 3) * 3;
            voxel(x * 28 + 1, y * 28 + 1, 16, 26, height, onRoute ? 'teal' : hill ? 'sage' : 'stone');
        }
    }
    // Stepped architectural forms and a route through the terrain.
    voxel(91, 34, 24, 36, 20, 'paper');
    voxel(95, 38, 44, 28, 20, 'paper');
    voxel(99, 42, 64, 20, 12, 'coral');
    voxel(176, 174, 40, 36, 20, 'mint');
    voxel(180, 178, 60, 28, 16, 'mint');
    voxel(187, 185, 76, 14, 12, 'paper');
    voxel(197, 57, 22, 14, 20, 'coral');
    voxel(0, 0, 0, 12, 14, 'coral', 'voxel--marker');
    world.append(fragment);

    let onScreen = true;
    function updateVisibility() { scene.classList.toggle('is-paused', document.hidden || !onScreen); }
    new IntersectionObserver(entries => {
        onScreen = entries[0].isIntersecting;
        updateVisibility();
    }).observe(scene);
    document.addEventListener('visibilitychange', updateVisibility);
})();