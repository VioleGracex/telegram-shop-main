const { Markup } = require("telegraf")

module.exports = {
    welcomeMessage: function (shopName) {
        return `Добро пожаловать в <b>${shopName}</b>

вставьте описание магазина здесь

<i>Нажмите на клавишу внизу клавиатуры, чтобы выбрать опцию.</i>
<i>Если клавиатура не открылась, вы можете открыть её, нажав на кнопку с четырьмя маленькими квадратами в строке сообщения.</i>
`
    },
    welcomeMenuButtons: function () {
        return Markup
            .keyboard([
                ["📚 Посмотреть категории", "🛒 Посмотреть корзину"]
            ])
            .resize()
    },
}