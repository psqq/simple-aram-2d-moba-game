import Game from './game';
import Victor from 'victor';


async function main() {
    var game = new Game();
    await game.load();
    game.player.bindEvents();
    game.viewport.setBounds({
        left: 0, right: game.maps.aram.pixelSize.x,
        top: 0, bottom: game.maps.aram.pixelSize.y,

    });
    game.mainloop.run();
}

main();
