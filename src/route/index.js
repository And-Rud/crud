// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, { email }) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.round(Math.random() * 100000)
    this.createData = new Date().toISOString()
  }
  static getList = () => this.#list
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (
    id,
    { name, price, description },
  ) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)

      return true
    } else {
      return false
    }
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    product.name = name
    product.price = price
    product.description = description
  }
}
// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false
  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})
// ================================================================
// Сторінка створення нового продукту
router.get('/product', function (req, res) {
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// Результат створення товару
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  res.render('alert', {
    style: 'alert',
    info: 'Товар доданий до списку товарів',
  })
})
// ================================================================
// Сторінка списку всіх продуктів
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  res.render('product-list', {
    style: 'index',
    data: {
      products: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// Отримаємо форму редагування
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  const list = [product]
  res.render('product-edit', {
    style: 'index',
    data: {
      product,
    },
  })
})
// ================================================================
// Редагуємо карточку
router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body
  const product = Product.getById(Number(id))
  Product.update(product, { name, price, description })
  res.render('alert', {
    style: 'alert',
    info: 'Інформація про товар оновлена',
  })
})
// ================================================================
// Видаляємо товар
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteById(Number(id))
  res.render('alert', {
    style: 'alert',
    info: 'Товар видалений',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
