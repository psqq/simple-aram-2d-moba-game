import Game from './game';


export default class UI {
    /**
     * @param {Object} o
     * @param {Game} o.game
     */
    constructor(o) {
        this.game = o.game;
        this.cs = $('.cs');
        this.gold = $('.gold');
        this.dmg = $('.dmg');
        this.shop = $('.shop');
        this.shopHiden = true;
    }
    bindEvents() {
        $(".buy-dmg").click(() => {
            var gold = this.game.player.entity.gold;
            if (gold < 50) return;
            this.game.player.entity.attackDamage += 100;
            this.game.player.entity.gold -= 50;
            this.update();
        });
    }
    toggleShop() {
        this.shopHiden = !this.shopHiden;
        if (this.shopHiden) {
            this.hideShop();
        } else {
            this.showShop();
        }
    }
    showShop() {
        this.shop.show();
    }
    hideShop() {
        this.shop.hide();
    }
    showCs() {
        this.cs.text(this.game.player.entity.cs);
    }
    showGold() {
        this.gold.text(this.game.player.entity.gold);
    }
    showDmg() {
        this.dmg.text(this.game.player.entity.attackDamage);
    }
    update() {
        this.showCs();
        this.showGold();
        this.showDmg();
    }
}
