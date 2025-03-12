const { Scenes } = require("telegraf");
const Utils = require("../utils");
const Template = require("../template");
const Voucher = require("../modules/voucher");

const welcomeScene = new Scenes.BaseScene("WELCOME_SCENE");

welcomeScene.enter(async (ctx) => {
    Utils.initializeScene(ctx);
    Utils.sendSystemMessage(ctx, Template.welcomeMessage(ctx.botInfo.first_name), Template.welcomeMenuButtons());
    const voucherCode = await Voucher.generateVoucher(ctx);
    Utils.sendSystemMessage(ctx, Template.voucherMessage(voucherCode));
});

welcomeScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message);

    if (ctx.message.text === "📚 Посмотреть категории") {
        ctx.scene.enter("CATEGORY_SCENE");
    } else if (ctx.message.text === "🛒 Посмотреть корзину") {
        ctx.scene.enter("CART_SCENE");
    }
});

welcomeScene.command("start", async (ctx) => {
    Utils.initializeScene(ctx);
    Utils.sendSystemMessage(ctx, Template.welcomeMessage(ctx.botInfo.first_name), Template.welcomeMenuButtons());
    const voucherCode = await Voucher.generateVoucher(ctx);
    Utils.sendSystemMessage(ctx, Template.voucherMessage(voucherCode));
});

welcomeScene.leave(async (ctx) => {
    try {
        console.log("Очистка приветственной сцены");
        await Utils.clearScene(ctx, true);
    } catch (error) {
        console.error("Ошибка при очистке приветственной сцены", error);
    }
});

module.exports = {
    welcomeScene
};