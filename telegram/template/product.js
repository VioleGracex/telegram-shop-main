const { Markup } = require("telegraf")
const numeral = require('numeral')

module.exports = {
    productCardMessage: function (product) {
        const caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Цена: <b>${numeral(product.price).format("$0,0.00")}</b>
Доступное количество: <b>${product.quantity}</b>
`
        return caption
    },
    productButtons: function (categoryName, product, quantity) {
        console.log("Byte length: ", new TextEncoder().encode(`POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`).length)
        const extra = Markup.inlineKeyboard(
            [
                [
                    { text: "➖ Убрать", callback_data: `POST /cart/${categoryName}/${product.name}/remove` },
                    { text: "➕ Добавить", callback_data: `POST /cart/${categoryName}/${product.name}/add` },
                ],
                [{
                    text: `Количество: ${quantity.toString()}`,
                    callback_data: `POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`
                }]
            ],
        )
        extra.parse_mode = "HTML"
        extra.caption = module.exports.productCardMessage(product)
        return extra
    },
    inputQuantityMessage: function (available, current, productName) {
        return `
Пожалуйста, введите число для предпочтительного количества, чтобы сделать заказ на <b>${productName}</b>.

Текущее количество: <b>${numeral(current).format("0,0")}</b>
Доступное количество для покупки: <b>${numeral(available).format("0,0")}</b>

<i>В настоящее время вы находитесь в режиме ввода только текста.</i>
<i>Введите 'cancel', чтобы выйти из этого режима.</i>
`
    },
    productWelcomeMessage: function (categoryName, shopName) {
        return `
Ниже представлен список продуктов из категории ${categoryName}, которые предлагает <b>${shopName}</b>.
`
    },
    productMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Вернуться на главную"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    cancelQuantityInputMessage: function () {
        return `
Вы успешно вышли из режима ввода текста.

Теперь вы можете продолжить просмотр каталога и выбрать количество, <b><i>переключая</i></b> кнопки добавления/удаления.

<i>Это сообщение будет удалено через 5 секунд для улучшения пользовательского опыта. Пожалуйста, не пугайтесь. 😊</i>
`
    },
    inputSuccessMessage: function (productName, previous, current) {
        return `
Вы успешно обновили количество для <b>${productName}</b> с <b>${previous}</b> до <b>${current}</b>.

Теперь вы можете продолжить просмотр каталога и выбрать количество, <b><i>переключая</i></b> кнопки добавления/удаления.

<i>Это сообщение будет удалено через 5 секунд для улучшения пользовательского опыта. Пожалуйста, не пугайтесь. 😊</i>
`
    },
}