const { Markup } = require("telegraf")

module.exports = {
    noteWelcomeMessage: function () {
        return `
Последний шаг перед тем, как мы сможем сгенерировать ваш счет! 🙂
`
    },
    noteMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Вернуться на главную"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    inputNoteMessage: function () {
        return `
Хотите оставить заметку вместе с заказом?

<i>Пожалуйста, отправьте сообщение, которое вы хотите разместить в вашем заказе, или нажмите кнопку "Пропустить" ниже этого сообщения, чтобы оставить без изменений</i>
`
    },
    inputNoteButton: function () {
        return Markup.inlineKeyboard([
            { text: "⏩ Пропустить", callback_data: "Skip" }
        ])
    },
    noteConfirmationMessage: function(message) {
        return `
Это заметка, которую вы хотите оставить продавцу: <i>${message}</i>
`
    },
    cancelNoteMessage: function () {
        return `
Вы только что отменили текущую заметку. Пожалуйста, оставьте другую заметку для продавца.
`
    },
}