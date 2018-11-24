import Game from './game';
import Victor from 'victor';


async function main() {
    var game = new Game();
    await game.load();
    var xy = 40;
    game.player.entity.setPosition(
        new Victor(
            xy,
            game.maps.aram.pixelSize.y - xy,
        )
    );
    xy = 70;
    game.minion.setPosition(
        new Victor(
            xy,
            game.maps.aram.pixelSize.y - xy,
        )
    );
    game.viewport.setBounds({
        left: 0, right: game.maps.aram.pixelSize.x,
        top: 0, bottom: game.maps.aram.pixelSize.y,

    });
    game.mainloop.run();
}

main();
