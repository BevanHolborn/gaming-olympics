const io = new IO();
const lo = new Olympics();
const n = new Nav();

async function setup()
{
    await io.INIT();
    await lo.INIT();
    await n.INIT();
}

setup();
