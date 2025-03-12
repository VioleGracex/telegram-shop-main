const { Markup } = require("telegraf")

module.exports = {
    registrationSuccessMessage: function (userID, username, shopName) {
        return `
Поздравляем <a href="tg://user?id=${userID}">@${username}</a>! Вы успешно настроили <b>${shopName}</b>. Теперь вы можете перейти по XXX url, чтобы добавить продукты и настроить ваш магазин!
`
    },
    htmlMode: function () {
        return { parse_mode: "HTML" }
    },
    confirmationButtons: function () {
        return Markup.inlineKeyboard([
            [
                { text: "✅ Подтвердить", callback_data: "Yes" },
                { text: "❌ Отменить", callback_data: "No" },
            ],
        ])
    },
    ...require("./category"),
    ...require("./welcome"),
    ...require("./cart"),
    ...require("./product"),
    ...require("./date"),
    ...require("./note"),
    ...require("./payment"),
    ...require("./voucher"),
}