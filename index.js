let express = require(`express`);
let handlebars = require(`express-handlebars`);
let Index = require(`./router/index`);
let Create = require(`./router/create`);
let Delete = require(`./router/delete`);
let Edit = require(`./router/edit`);
let Generate = require(`./router/generate`);
let Load = require(`./router/load`);
let Register = require(`./router/register`);
let session = require(`express-session`); // Сессия
let keys = require(`./keys/keys.dev`); // Ключи
let MongoStore = require(`connect-mongodb-session`)(session);
let flash = require(`connect-flash`);
let Auth = require(`./router/auth`);
let csrf = require(`csurf`);
let Protect = require(`./middleware/protect`); // Создаем ключь accept и csrf публичьным ключем
let Logout = require(`./router/logout`); // Выйти из аккаунта
let mongoose = require(`mongoose`);
let helmet = require(`helmet`); // Модуль для защиты хедеров
let compression = require(`compression`); // Модуль для сжатия картинок


let app = express();

let PORT = process.env.PORT || 3000;


let hbs = handlebars.create({ // Настройка Handelbars
  defaultLayout: `main`,
  extname: `hbs`,
  helpers: require(`./utils/helper`)
})
let store = new MongoStore({ // Настройка MongoStore и сохранения сессии в базу данных
  collection: `sessions`,
  uri: keys.mongoURL
})

app.engine(`hbs`, hbs.engine);
app.set(`view engine`, `hbs`);
app.set(`views`, `views`);
app.use(express.static(`public`))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({ // Настройка сессии
  secret: keys.secret,
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(compression());
app.use(flash()); // Использования модуль flash()
app.use(helmet({
  contentSecurityPolicy: false
})); // Модуль для защиты хедеров
app.use(csrf()); // Защита от csrf атак
app.use(Protect); // Проверка пользователя на авторизацию


app.use(`/`, Auth); // Страница авторизации
app.use(`/loat`, Index); // Страница дневника
app.use(`/create`, Create); // Создания записи в дневнике
app.use(`/delete`, Delete); // Удаления записи в дневнике
app.use(`/edit`, Edit); // Редактирования выбранной записи в дневнике
app.use(`/generate`, Generate); // Генерация всех оставшихся дней в текущем месяце
app.use(`/load`, Load); // Подгрузка 10 записец при скроле окна дневника вверх
app.use(`/register`, Register); // Страница регистрации
app.use(`/logout`, Logout); // Деавторизация из сесси и выход из дневника

// Запуск базы данных, после чего запуск сервера
let startBD = async ()=>{
  await mongoose.connect(keys.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  app.listen(PORT, ()=>{
    console.log(`Дневник запущен`);
  })  
}

startBD()


