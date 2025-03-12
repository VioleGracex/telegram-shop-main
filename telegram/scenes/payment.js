const { Scenes } = require("telegraf");
const numeral = require("numeral");
const moment = require("moment");
const _ = require("lodash");
const Cart = require("../modules/cart");
const Utils = require("../utils");
const Voucher = require("../modules/voucher");
const Payment = require("../modules/payment");
const Template = require("../template");

const paymentScene = new Scenes.BaseScene("PAYMENT_SCENE");

/**
 * Upon entering, scene contains:
 * 1. Voucher applied (i.e. ctx.scene.state.voucher)
 * 2. Delivery date, if any (i.e. ctx.scene.state.deliveryDate)
 * 3. Note, if any (i.e. ctx.scene.state.note)
 */

paymentScene.enter(async (ctx) => {
    try {
        Utils.initializeScene(ctx);
        await Utils.sendSystemMessage(ctx, Template.paymentWelcomeMessage(), Template.paymentMenuButtons());

        const priceLabels = await Cart.getPriceLabelsOfCart(ctx.botInfo.id, ctx.from.id, ctx.scene.state.voucher);
        const totalCost = _.sumBy(priceLabels, (label) => label.amount);

        const providerToken = process.env.PROVIDER_TOKEN;
        if (!providerToken) {
            throw new Error('MISSING_PROVIDER_TOKEN');
        }

        const invoice = await ctx.replyWithInvoice({
            chat_id: ctx.chat.id,
            provider_token: providerToken,
            start_parameter: "get_access",
            title: `Счет (${moment().format("HH:mm A, DD/MM/YYYY")})`,
            description: `Ваша общая сумма заказа составляет ${numeral(totalCost / 100).format("$0,0.00")}.`,
            currency: "SGD",
            prices: priceLabels,
            payload: {
                id: ctx.from.id,
                voucherID: ctx.scene.state.voucher ? ctx.scene.state.voucher.id : null
            },
            need_shipping_address: true,
            need_phone_number: true,
        });

        Utils.updateInvoiceMessageInState(ctx, invoice);
    } catch (error) {
        if (error.message === 'MISSING_PROVIDER_TOKEN') {
            await ctx.reply('Токен поставщика платежных услуг отсутствует. Пожалуйста, свяжитесь с поддержкой.');
        } else if (error.response && error.response.error_code === 400 && error.response.description === 'Bad Request: PAYMENT_PROVIDER_INVALID') {
            await ctx.reply('Похоже, возникла проблема с поставщиком платежных услуг. Пожалуйста, попробуйте позже.');
        } else {
            await ctx.reply('Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.');
        }
        await ctx.reply('Возвращаемся на главный экран.', Template.homeKeyboard);
        ctx.scene.enter("WELCOME_SCENE"); // Transition to the welcome scene
    }
});

paymentScene.on("successful_payment", async (ctx) => {
    try {
        console.log("Успешный платеж", ctx.message.successful_payment);
        Utils.replaceInvoiceToReceiptInState(ctx);

        const payment = ctx.message.successful_payment;
        const invoice = JSON.parse(payment.invoice_payload);
        const hasVoucherApplied = invoice.voucherID;

        if (hasVoucherApplied) {
            await Voucher.updateVoucherForUser(invoice.id, invoice.voucherID);
        }

        const addressDetails = {
            lineOne: payment.order_info.shipping_address.street_line1,
            lineTwo: payment.order_info.shipping_address.street_line2,
            city: payment.order_info.shipping_address.city,
            country: payment.order_info.shipping_address.country_code,
            postalCode: payment.order_info.shipping_address.post_code,
            mobile: payment.order_info.phone_number,
        };

        await Payment.createPayment(ctx, addressDetails, ctx.scene.state.deliveryDate, ctx.scene.state.note);
        ctx.scene.enter("WELCOME_SCENE"); // Transition to the welcome scene
    } catch (error) {
        console.error('Ошибка при обработке успешного платежа:', error);
        await ctx.reply('Произошла проблема с обработкой вашего платежа. Пожалуйста, свяжитесь с поддержкой.');
        await ctx.reply('Возвращаемся на главный экран.');
        ctx.scene.enter("WELCOME_SCENE"); // Transition to the welcome scene
    }
});

paymentScene.on("message", async (ctx) => {
    Utils.updateUserMessageInState(ctx, ctx.message.message_id);
    Utils.checkForHomeButton(ctx);
});

paymentScene.leave(async (ctx) => {
    console.log("Очистка сцены платежей");
    await Utils.clearScene(ctx, true);
});

module.exports = {
    paymentScene
};