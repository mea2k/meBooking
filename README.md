# meBooking

## Описание сервера

Сервер бронирования номеров гостиниц с аутентификацией, написан на языке программирования TypeScript с использованием платформы NestJS, с возможностью использовать в качестве хранилища JSON-файлы или БД Mongo. Поддерживается аутентификация по логину и паролю, а также по токену (JWT).

__Стек инструментов__
- NodeJs;
- NestJs;
- RxJs;
- Jwt;
- WebSocket;
- JSON;
- Mongo (Mongoose).


Код соответствует ВСЕМ (_почти_) требованиям **SOLID**.

__Основные возможности сервера:__
1. Регистрация пользователей с различными ролями (`client`, `manager`, `admin`).
2. Аутентификация пользователя с использованием логина-пароля, а также токена JWT.
3. Добавление/редактирование/удаление/поиск гостиниц.
4. Добавление/редактирование/удаление/поиск номеров гостиниц.
5. Добавление/редактирование/удаление/поиск броней гостиниц.
6. Чат с поддержкой.
7. Использование в качестве хранилища файлы формата JSON или СУБД Mongo.


17. _(дополнительно)_ Получение всех настроек (переменных окружения) (`GET /config`)
18. _(дополнительно)_ Получение значения переменной окружения по имени (`GET /config/{variable}`)


## Хранилище

### Параметризированный/шаблонный интерфейс "ХРАНИЛИЩЕ" (generic)

Для реализации контейнеров подготовлены абстрактные классы на основе базового интерфейса с параметрическими типами данных `ItemStorage<ItemType, ItemTdoType, KeyType>` ([src/common/interfaces/itemStorage.ts](src/common/interfaces/itemStorage.ts)).

Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemDtoType` - тип элемента для добавления/обновления объекта
- `KeyType` - тип ключевого параметра объекта

Обязательные для реализации у наследников методы интерфейса:
- `getAll()` - получение всего содержимого контейнера (массив объектов `ItemType[]`);
- `get(id)`  - получение одного объекта типа `ItemType` по идентификатору ID (тип идентификатора - `KeyType`);
- `create(item)` - добавление объекта в хранилище. Объект описывается типом `ItemDtoType`. ID объекта должно формироваться автоматически в реализации интерфейса;
- `update(id, item)` - изменение содержимого полей объекта с идентификатором ID (ID типа `KeyType`, item типа `ItemDtoType`);
- `delete(id)` - удаление объекта с идентификатором ID (ID типа `KeyType`). Возвращает `TRUE` в случае успеха или `FALSE`, если объект не найден (через Promise).

**Результаты всех методов возвращают Promise!**

### Абстрактный базовый класс "ХРАНИЛИЩЕ"

На базе интерфейса `ItemStorage` реализован абстрактный параметризированный класс `Storage<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/storage/storage.ts](src/storage/storage.ts).


Параметрические типы данных:
- `ItemType` - тип хранимого объекта
- `ItemTypeDto` - тип элемента для добавления/обновления объекта
- `KeyName` - наименование ключевого поля в объекте типа `ItemType` (должен быть определен в типе `ItemType`). Тип ключевого поля вычисляется автоматически.


Дополнительные атрибуты и методы:
- `protected _keyName: KeyName` - имя ключевого поля объекта (оно будет иметь тип `KeyName`, фактически значение будет совпадать с типом)
- `protected _debug: boolean` - флаг отладки (если true - в консоль выдается дополнительная информация)
- `protected abstract _getNextId(id: ItemType[KeyName] | null): ItemType[KeyName]` - получение следующего по следованию значения поля идентификатора (используется для поиска ближайшего незанятого)

Все методы интерфейса `ItemStorage` реализованы в качестве абстрактных методов, то есть их потребуется переопределять в зависимости от типа хранилища.


### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ ФАЙЛА"

На базе абстрактного класса `Storage` реализован абстрактный параметризированный класс `StorageFile<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/storage/storageFile.ts](src/storage/storageFile.ts).


Дополнительные атрибуты и методы:
- `protected _storage: Array<ItemType>`  - само хранилище объектов (контейнер объектов)
- `protected _fileName: string` - имя файла, в котором будет храниться контейнер
- `protected _dumpToFile()` - сохранение содержимого контейнера `_storage` в JSON-файл `_fileName`
- конструктор  `constructor(fileName: string, key: KeyName, debug = true) ` - передаются 3 параметра: имя файла, имя ключевого параметра объекта и значение флага отладки

Реализованы все методы интерфейса `ItemStorage` для работы с контейнером `_storage` и сохранением всех изменений в файле `_filename`.


### Абстрактный класс "ХРАНИЛИЩЕ НА ОСНОВЕ БД Mongo"

На базе абстрактного класса `Storage` реализован абстрактный параметризированный класс `StorageDb<ItemType, ItemTypeDto, KeyName extends keyof ItemType>` [src/storage/storageDb.ts](src/storage/storageDb.ts).

Дополнительные атрибуты и методы:
- `protected _model: mongoose.Model<ItemType & Document>` - модель для работы с коллекцией объектов типа `ItemType` в БД Mongo 
- конструктор  `constructor(model: Model<ItemType>, key: KeyName, debug = true)` - передаются 3 параметра: модель (Mongoose) для работы с БД, имя ключевого параметра объекта 

Реализованы все методы интерфейса `ItemStorage` для работы с использованием модели `_model`.


## Модули

В приложении реализованы следующие модули:
1. `CONFIG` ([src/modules/config/config.module.ts](src/modules/config/config.module.ts)) - настройки параметров функционирования сервера (загрузка переменных окружения из файла .env, поиск значения переменных окружения).
2. `USERS`  ([src/modules/users/users.module.ts](src/modules/users/users.module.ts)) - работа с пользователями (добавление, хранение, профиль,запросы информации о пользователях).
3. `AUTH`  ([src/modules/auth/auth.module.ts](src/modules/auth/auth.module.ts)) - аутентификация пользователей и формирование JWT для доступа к функциям сервера.
4. `HOTELS` ([src/modules/hotels/hotels.module.ts](src/modules/hotels/hotels.module.ts)) - работа с гостиницами (добавление, хранение, редактирование, удаление, поиск).
5. `HOTEL-ROOMS` ([src/modules/hotel-rooms/hotel-rooms.module.ts](src/modules/hotel-rooms/hotel-rooms.module.ts)) - работа с номерами гостиниц (добавление, хранение, редактирование, удаление, поиск).
5. `RESERVATIONS` ([src/modules/reservations/reservations.module.ts](src/modules/reservations/reservations.module.ts)) - работа с бронями номеров гостиниц (добавление, хранение, редактирование, удаление, поиск).
6. `SUPPORT` ([src/modules/support/support.module.ts](src/modules/support/support.module.ts)) - работа с чатом (добавление, хранение, отправка сообщений, получение уведомлений, редактирование статуса сообщений, поиск).
7. `APP`  ([src/app.module.ts](src/app.module.ts)) - само приложение.


### Модуль "CONFIG"

Модуль `CONFIG` содержит все настройки функционирования приложения и других модулей. Реализован на основе стандартного модуля `ConfigModule`. Все настройки подгружаются в качестве переменных окружения (`process.env`) из файла [.env](.env). Название файла задается при запуске приложения в переменной `ENV_FILE` (по умолчанию, `.env` в текущей папке).

Все возможные параметры описаны в интерфейсе `IConfig` ([src/modules/config/config.interfaces.ts](src/modules/config/config.interfaces.ts)).


**Контроллер модуля** - `ConfigController` ([src/modules/config/config.controller.ts](src/modules/config/config.controller.ts)):
- реализует обработку URL-путей:
  * `/config` - получение значения всех переменных окружения (вызов метода `getAll()` у класса `ConfigService`);
  * `/config/{key}` - получение значения переменной `{key}` (вызов метода `get(key)` у класса `ConfigService`).

Модуль `CONFIG` ([src/modules/config/config.module.ts](src/modules/config/config.module.ts)) экспортирует класс `ConfigService`, который является инжектируемым (`@Injected()`) в провайдеры других модулей. При этом создается всегда не более одного экземпляра объекта `ConfigService`. При его создании он существует все время функционирования приложения (`{ scope: Scope.DEFAULT }`).


### Модуль "USERS"

Модуль `USERS` содержит весь функционал по работе с пользователями. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/users/users.module.ts](src/modules/users/users.module.ts)).


#### Интерфейсы модуля

Объект **ПОЛЬЗОВАТЕЛЬ** (`IUser`)([src/modules/users/users.interfaces.ts](src/modules/users/users.interfaces.ts#L18)):
```
{
	_id: IDType;
	email: string;
	login: string;
	name: string;
	passwordHash?: string;
	contactPhone?: string;
	role: UserRoleType;
}
```

`IDType` - пользовательский тип данных (`string | number | Types.ObjectId`) описан в общих файлах ([src/common/interfaces/types.ts](src/common/interfaces/types.ts)).

`UserRoleType` предусматривает три значения роли пользователя: `CLIENT`, `MANAGER`, `ADMIN`.

#### Контроллер модуля

Контроллер модуля `UsersController` ([src/modules/users/users.controller.ts](src/modules/users/users.controller.ts)) реализует обработку URL-путей:

- `POST /api/users/client/register` - регистрация клиента. Входные данные формата `IUserCreateDto` ([src/modules/users/users.interfaces.ts](src/modules/users/users.interfaces.ts#L42)):
```
 {
	email: string;
 	login: string;
	name: string;
	password1: string;
	password2: string;
	contactPhone?: string;
	role?: string; // (по умолчанию CLIENT)
 }
```

- `POST /api/users/admin/register` - регистрация пользователя с любой ролью. Входные данные формата `IUserCreateDto` ([src/modules/users/users.interfaces.ts](src/modules/users/users.interfaces.ts#L42)).

- `GET /api/users/manager` - поиск пользователей с ролью `MANAGER` *(доступно только пользователям-менеджерам)*.
Параметры поиска передаются в URL-строке в соответствии с интерфейсом `SearchUsersParams` ([src/modules/users/users.interfaces.ts](src/modules/users/users.interfaces.ts#L82)):
```
{
	email?: string;
	name?: string;
	contactPhone?: string;
	role?: UserRoleType;
	offset?: number;
	limit?: number;
}
```

- `GET /api/users/admin` - поиск пользователей с ролью `ADMIN` *(доступно только пользователям-админам)*.

- `GET /api/users/:id` - получение информации о пользователе с указанным ID.

- `GET /api/users/profile` - профиль аутентифицированного пользователя *(доступно только после аутентификации)*.

- `DELETE /api/users/:id` - удаление пользователя *(доступно только пользователям-админам)*.


#### Валидация входных данных

Для проверки корректности входных данных при регистрации пользователя реализован валидатор `UsersDtoValidator` ([src/modules/users/validators/usersDtoValidator.ts](src/modules/users/validators/usersDtoValidator.ts)), который проверяет корректность формата email, заполненных обязательных полей и совпадение паролей password1 и password2.



#### Контейнеры для хранения пользователей

Для работы с объектами типа `IUser` реализованы наследники абстрактных классов:
- `class UserStorageFile extends StorageFile<IUSer, IUSerDto, '_id'>` - контейнер пользователей на основе JSON-файла ([src/modules/users/storage/userStorageFile.ts](src/modules/users/storage/userStorageFile.ts));
- `class UserStorageDb extends StorageDb<UserDocument, IUSerDto, '_id'>` - контейнер пользователей на основе БД Mongo ([src/modules/users/storage/userStorageDb.ts](src/modules/users/storage/userStorageDb.ts)).

В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType;
- переопределен наследуемый метод `create(item)`, который проверяет login и email на уникальность.

Помимо этого, добавлены специфические методы:
- `getByLogin(login: string)` - получение информации о пользователе по полю `login`;
- `getByEmail(email: string)` - получение информации о пользователе по полю `email`;
- `search(params: SearchUserParams)` - поиск пользователей по заданным критериям ([src/modules/users/users.interfaces.ts](src/modules/users/users.interfaces.ts#L82)).

Имя файла для хранения данных задается в переменной `USERS_FILE`.

Для работы с БД Mongo реализована схема данных `UserSchema` ([src/modules/users/storage/userSchema.ts](src/modules/users/storage/userSchema.ts)).


### Модуль "AUTH"

Модуль `AUTH` содержит весь функционал по аутентификации пользователей. Модуль импортирует модули `CONFIG`, `UsersModule`, а также библиотечный модуль генерации JWT - `JwtModule` ([src/modules/auth/auth.module.ts](src/modules/auth/auth.module.ts)).


#### Интерфейсы модуля

Аутентификация осуществляется на основе данных, описанных интерфейсом `IUSerAuthDto` ([src/modules/auth/auth.interfaces.ts](src/modules/auth/auth.interfaces.ts)):
```
{
	login: string;
	password: string;
}
```

#### Контроллер модуля

Контроллер модуля - `AuthController` ([src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts)) реализует обработку URL-путей:
- `POST /api/users/login` - авторизация пользователя.  Входные данные формата `IUSerAuthDto`;
- `POST /api/users/token` - авторизация с получением токена JWT. Входные данные формата `IUSerAuthDto`;


#### Валидация входных данных

Для проверки корректности входных данных при авторизации пользователя реализован валидатор `UserAuthValidator` ([src/modules/auth/validators/userAuthValidator.ts](src/modules/auth/validators/userAuthValidator.ts)).


#### Авторизация по JWT

Для прохождения авторизации по токену и подключения информации о пользователе в глобальный запрос Request, используется `AuthGuard` ([src/modules/auth/guards/auth.guard.ts](src/modules/auth/guards/auth.guard.ts)).
В нем осуществляется расшифровка JWT с использованием секретного ключа, далее проверка на валидность и извлечение данных о пользователе.

#### Авторизация по роли

Для прохождения авторизации по роли пользователя используется `RolesGuard` ([src/modules/auth/guards/role.guard.ts](src/modules/auth/guards/role.guard.ts)).
В нем осуществляется расшифровка JWT с использованием секретного ключа, далее проверка на валидность, извлечение данных о пользователе, в том числе и его роль, и проверка на соответствие роли пользователя требуемой (переданной в качестве параметров обработчику).


#### Генерация JWT

Для генерации JWT используются переменные окружения, подгружаемые из модуля `CONFIG`:
- `JWT_SECRET` - секретное слово токена;
- `JWT_EXPIRE` - время жизни токена.

Данные переменные задаются в файле `.env` при запуске.


### Модуль "HOTELS"

Модуль `HOTELS` содержит весь функционал по работе с гостиницами. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/hotels/hotels.module.ts](src/modules/hotels/hotels.module.ts)).


#### Интерфейсы модуля

Объект **ГОСТИНИЦА** (`IHotel`)([src/modules/hotels/hotels.interfaces.ts](src/modules/hotels/hotels.interfaces.ts#L16)):
```
{
	_id: IDType;
	title: string;
	description?: string;
	createdAt: Date;
	updatedAt?: Date;
}
```

#### Контроллер модуля

Контроллер модуля `HotelsController` ([src/modules/hotels/hotels.controller.ts](src/modules/hotels/hotels.controller.ts)) реализует обработку URL-путей:

- `POST /api/hotels/register` - регистрация новой гостиницы *(доступно только пользователям-админам)*. Входные данные формата `IHotelCreateDto` ([src/modules/hotels/hotels.interfaces.ts](src/modules/hotels/hotels.interfaces.ts#L33)):
```
{
	title: string;
	description?: string;
}
```

- `PUT /api/hotels/:id` - изменение данных гостиницы с идентификатором `ID` *(доступно только пользователям-админам)*. Входные данные формата `IHotelCreateDto` ([src/modules/hotels/hotels.interfaces.ts](src/modules/hotels/hotels.interfaces.ts#L33)).

- `GET /api/hotels` - получение списка всех гостиниц. В качестве URL-параметров можно передавать `offset` и `limit`.


- `GET /api/hotels/:id` - получение информации о гостинице с указанным ID.

- `GET/POST /api/hotels/search` - поиск гостиниц по указанным в URL/теле запроса параметрам. Входные данные формата `SearchHotelParams` ([src/modules/hotels/hotels.interfaces.ts](src/modules/hotels/hotels.interfaces.ts#L63)):
```
{
	title: string;
	limit?: number;
	offset?: number;
}
```

- `DELETE /api/hotels/:id` - удаление гостиницы с идентификатором `ID` *(доступно только пользователям-админам)*.


#### Валидация входных данных

Для проверки корректности критериев поиска реализован валидатор `SearchHotelParamsDto` ([src/modules/hotels/validators/searchHotelParamsValidator.ts](src/modules/hotels/validators/searchHotelParamsValidator.ts)), который проверяет корректность полей `offset` и `limit` и преобразует их к типу `number`.


#### Контейнеры для хранения гостиниц

Для работы с объектами типа `IHotel` реализованы наследники абстрактных классов:
- `class HotelStorageFile extends StorageFile<IHotel, IHotelDto, '_id'>` - контейнер гостиниц на основе JSON-файла ([src/modules/hotels/storage/hotelStorageFile.ts](src/modules/hotels/storage/hotelStorageFile.ts));
- `class HotelStorageDb extends StorageDb<HotelDocument, IHotelDto, '_id'>` - контейнер гостиниц на основе БД Mongo ([src/modules/hotels/storage/hotelStorageDb.ts](src/modules/hotels/storage/hotelStorageDb.ts)).

В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType;
- переопределен наследуемый метод `create(item)`, который проверяет login и email на уникальность.

Помимо этого, добавлены специфические методы:
- `search(params: SearchHotelParams)` - поиск гостиниц по заданным критериям ([src/modules/hotels/hotels.interfaces.ts](src/modules/hotels/hotels.interfaces.ts#L63)).

Имя файла для хранения данных задается в переменной `HOTELS_FILE`.

Для работы с БД Mongo реализована схема данных `HotelSchema` ([src/modules/hotels/storage/hotelSchema.ts](src/modules/hotels/storage/hotelSchema.ts)).


### Модуль "HOTEL-ROOMS"

Модуль `HOTEL-ROOMS` содержит весь функционал по работе с номерами гостиниц. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/hotel-rooms/hotel-rooms.module.ts](src/modules/hotel-rooms/hotel-rooms.module.ts)).


#### Интерфейсы модуля

Объект **НОМЕРА** (`IHotelRoom`)([src/modules/hotel-rooms/hotel-rooms.interfaces.ts](src/modules/hotel-rooms/hotel-rooms.interfaces.ts#L20)):
```
{
	_id: IDType;
	hotel: IDType;
	title: string;
	description?: string;
	services?: string[];
	images?: string[];
	createdAt: Date;
	updatedAt?: Date;
	isEnabled: boolean;
}
```

#### Контроллер модуля

Контроллер модуля `HotelRoomsController` ([src/modules/hotel-rooms/hotel-rooms.controller.ts](src/modules/hotel-rooms/hotel-rooms.controller.ts)) реализует обработку URL-путей:


- `POST /api/hotels/rooms` - добавление нового номера гостиницы *(доступно только пользователям-менеджерам)*. Входные данные формата `IHotelRoomCreateUpdateDto` ([src/modules/hotel-rooms/hotel-rooms.interfaces.ts](src/modules/hotel-rooms/hotel-rooms.interfaces.ts#L44)):
```
{
	hotel: string;
	title: string;
	description?: string;
	services?: string[];
	images?: string[];
	isEnabled?: boolean;	// по умолчанию true
}
```

- `PUT /api/hotels/rooms/:id` - изменение параметров номера гостиницы с идентификатором `ID` *(доступно только пользователям-менеджерам)*. Входные данные формата `IHotelRoomCreateUpdateDto` ([src/modules/hotel-rooms/hotel-rooms.interfaces.ts](src/modules/hotel-rooms/hotel-rooms.interfaces.ts#L44)).


- `GET /api/hotels/:id/rooms` - получение списка номеров гостиницы с указанным ID. В качестве URL-параметров можно передавать `offset` и `limit`.


- `GET /api/hotels/rooms/:id` - получение информации о номере с идентификатором `ID`.

- `GET/POST /api/hotels/rooms/search` - поиск номеров гостиниц по указанным в URL/теле запроса параметрам. Входные данные формата `SearchHotelRoomParams` ([src/modules/hotel-rooms/hotel-rooms.interfaces.ts](src/modules/hotel-rooms/hotel-rooms.interfaces.ts#L92)):
```
{
	title: string;
	hotel?: IDType;
	services?: string[];	//логика поиска 'И'
	isEnabled?: boolean;
	limit?: number;
	offset?: number;
}
```

- `DELETE /api/hotels/rooms/:id` - удаление номера с идентификатором `ID` *(доступно только пользователям-менеджерам)*.


#### Валидация входных данных

Для проверки корректности входных данных при добавлении нового номера реализован валидатор `HotelRoomCreateDtoValidator` ([src/modules/hotel-rooms/validators/hotelRoomDtoValidator.ts](src/modules/hotel-rooms/validators/hotelRoomDtoValidator.ts#L6)), который проверяет заполненность обязательных полей (`hotel`, `title`) и заполняет поле `isEnabled=true`, если оно не задано.

Для проверки корректности входных данных при редактировании номера реализован валидатор `HotelRoomUpdateDtoValidator` ([src/modules/hotel-rooms/validators/hotelRoomDtoValidator.ts](src/modules/hotel-rooms/validators/hotelRoomDtoValidator.ts#L31)), который проверяет заполненность обязательных полей (`hotel`, `title`) и корректность поля `isEnabled`.

Для проверки корректности критериев поиска реализован валидатор `SearchHotelRoomParamsDto` ([src/modules/hotel-rooms/validators/searchHotelRoomParamsValidator.ts](src/modules/hotel-rooms/validators/searchHotelRoomParamsValidator.ts)), который проверяет корректность полей `offset` и `limit` и преобразует их к типу `number`, а также поле `isEnabled` к типу `boolean`.


#### Контейнеры для хранения номеров

Для работы с объектами типа `IHotelRoom` реализованы наследники абстрактных классов:
- `class HotelRoomStorageFile extends StorageFile<IHotelRoom, IHotelRoomDto, '_id'>` - контейнер номеров гостиниц на основе JSON-файла ([src/modules/hotel-rooms/storage/hotelroomStorageFile.ts](src/modules/hotel-rooms/storage/hotelroomStorageFile.ts));
- `class HotelRoomStorageDb extends StorageDb<HotelRoomDocument, IHotelRoomDto, '_id'>` - контейнер номеров гостиниц на основе БД Mongo ([src/modules/hotel-rooms/storage/hotelroomStorageDb.ts](src/modules/hotel-rooms/storage/hotelroomStorageDb.ts)).

В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType.

Помимо этого, добавлены специфические методы:
- `search(params: SearchHotelRoomParams)` - поиск номеров по заданным критериям ([src/modules/hotel-rooms/hotel-rooms.interfaces.ts](src/modules/hotel-rooms/hotel-rooms.interfaces.ts#L92)).

Имя файла для хранения данных задается в переменной `HOTELROOMS_FILE`.

Для работы с БД Mongo реализована схема данных `HotelRoomSchema` ([src/modules/hotel-rooms/storage/hotelroomSchema.ts](src/modules/hotel-rooms/storage/hotelroomSchema.ts)).



### Модуль "RESERVATIONS"

Модуль `RESERVATIONS` содержит весь функционал по работе с бронированием номеров гостиниц. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService`, `USERS`, `HOTELS`, `HOTELS-ROOMS` ([src/modules/reservations/reservations.module.ts](src/modules/reservations/reservations.module.ts)).


#### Интерфейсы модуля

Объект **БРОНЬ** (`IReservation`)([src/modules/reservations/reservations.interfaces.ts](src/modules/reservations/reservations.interfaces.ts#L20)):
```
{
	_id: IDType;
	userId: IDType;
	hotelId: IDType;
	roomId: IDType;
	dateStart: Date;
	dateEnd: Date;
	description?: string;
	hotelRoom?: {
		description?: string;
		services: string[];
		images?: string[];
	};
	hotel?: {
		title: string;
		description?: string;
	};
}
```

#### Контроллер модуля

Контроллер модуля `ReservationsController` ([src/modules/reservations/reservations.controller.ts](src/modules/reservations/reservations.controller.ts)) реализует обработку URL-путей:

- `POST /api/reservations/` - создание новой брони *(доступно только пользователям-клиентам)*. Осуществляется проверка на отсутствие брони на указанный номер и указанный период ([src/modules/reservations/reservations.service.ts](src/modules/reservations/reservations.service.ts#L158)). Входные данные формата `IReservationCreateUpdateDto` ([src/modules/reservations/reservations.interfaces.ts](src/modules/reservations/reservations.interfaces.ts#L50)):
```
{
	roomId: string;
	dateStart: Date;
	dateEnd: Date;
	description?: string;
}
```

- `PUT /api/reservations/:id` - изменение параметров брони с идентификатором ID *(доступно только пользователям-менеджерам)*. Входные данные формата `IReservationCreateUpdateDto` ([src/modules/reservations/reservations.interfaces.ts](src/modules/reservations/reservations.interfaces.ts#L50)).

- `GET /api/reservations` - получение списка всех броней *(доступно только пользователям-менеджерам)*.

- `GET /api/reservations/room/:id` - получение всех броней на конкретный номер с идентификатором `ID`.

- `GET /api/reservations/user/:id` - получение всех броней пользователя с идентификатором `ID` *(доступно только пользователям-менеджерам и клиентам)*.

- `GET /api/reservations/user` - получение всех броней авторизованного клиента *(доступно только авторизованному пользователю-клиенту)*.

- `GET /api/reservations/:id` - получение информации о брони с идентификатором `ID`.

- `POST /api/reservations/search` - поиск броней по указанным в теле запроса параметрам *(доступно только пользователям-менеджерам)*. Входные данные формата `SearchReservationParams` ([src/modules/reservations/reservations.interfaces.ts](src/modules/reservations/reservations.interfaces.ts#L89)):
```
{
	userId?: IDType;
	dateStart?: Date;
	dateEnd?: Date;
	limit?: number;
	offset?: number;
}
```

- `DELETE /api/reservations/:id` - отмена/удаление брони с идентификатором `ID` *(доступно только пользователям-менеджерам и клиентам)*.


#### Валидация входных данных

Для проверки корректности входных данных при добавлении брони реализован валидатор `ReservationDtoValidator` ([src/modules/reservations/validators/reservationDtoValidator.ts](src/modules/reservations/validators/reservationDtoValidator.ts#L6)), который проверяет заполненность обязательных полей (`roomId`, `dateStart`, `dateEnd`), проверка на корректность дат (`dateEnd > dateStart`).


#### Контейнеры для хранения броней

Для работы с объектами типа `IReservation` реализованы наследники абстрактных классов:
- `class ReservationStorageFile extends StorageFile<IReservation, IReservationDto, '_id'>` - контейнер ,броней на основе JSON-файла ([src/modules/reservations/storage/reservationStorageFile.ts](src/modules/reservations/storage/reservationStorageFile.ts));
- `class ReservationStorageDb extends StorageDb<ReservationDocument, IReservationDto, '_id'>` - контейнер броней на основе БД Mongo ([src/modules/reservations/storage/reservationStorageDb.ts](src/modules/reservations/storage/reservationStorageDb.ts)).

В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType.

Помимо этого, добавлены специфические методы:
- `search(params: SearchReservationParams)` - поиск номеров по заданным критериям ([src/modules/reservations/reservations.interfaces.ts](src/modules/reservations/reservations.interfaces.ts#L89)).

Имя файла для хранения данных задается в переменной `RESERVATIONS_FILE`.

Для работы с БД Mongo реализована схема данных `ReservationSchema` ([src/modules/reservations/storage/reservationSchema.ts](src/modules/reservations/storage/reservationSchema.ts)).



### Модуль "SUPPORT"

Модуль `SUPPORT` содержит весь функционал по работе с чатами между клиентами и менеджерами. Модуль импортирует модуль `CONFIG`, а конкретнее класс `ConfigService` ([src/modules/support/support.module.ts](src/modules/support/support.module.ts)).


#### Интерфейсы модуля

Объект **ЧАТ** (`ISupportChat`)([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L16)):
```
{
	_id: IDType;
	user: IDType;
	createdAt: Date;
	isActive?: boolean;
	messages?: IChatMessage[];
}
```

Объект **СООБЩЕНИЕ** (`IChatMessage`)([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L35)):
```
{
	_id: IDType;
	chat: IDType;
	author: IDType;
	sentAt: Date;
	text: string;
	readAt?: Date;
}
```


#### Контроллер модуля

Контроллер модуля `SupportController` ([src/modules/support/support.controller.ts](src/modules/support/support.controller.ts)) реализует обработку URL-путей:

- `POST /api/support` - создание чата *(доступно только пользователям-клиентам)*. Входные данные формата `ISupportChatCreateUpdateDto` ([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L53)):
```
{
	user: string;
	text: string;
	isActive?: boolean;		// по умолчанию true
}
```

- `PUT /api/support/:id` - изменение параметров чата (закрытие) с идентификатором ID *(доступно только пользователям-менеджерам)*. Входные данные формата `ISupportChatCreateUpdateDto` ([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L53)).

- `POST /api/support/:id` - отправка сообщения в чат с идентификатором ID *(доступно только пользователям-менеджерам и клиентам)*. Входные данные формата `ISendChatMessageDto` ([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L86)):
```
{
	author?: string;
	supportChat?: string;
	text: string;
}
```

- `GET /api/support` - получение списка всех чатов *(доступно только пользователям-менеджерам)*. В качестве URL-параметров можно передавать `offset` и `limit`.

- `GET /api/support/user` - получение всех чатов авторизованного клиента *(доступно только авторизованному пользователю-клиенту)*.
В качестве URL-параметров можно передавать `offset` и `limit`.

- `GET /api/support/user/:id` - получение всех чатов пользователя с идентификатором `ID` *(доступно только пользователям-менеджерам)*. Входные данные формата `ISearchChatParams` ([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L147)):
```
{
	user?: string;
	isActive?: boolean;
	limit?: number;
	offset?: number;
}
```

- `GET /api/support/:id` - получение списка сообщений чата с идентификатором `ID` *(доступно только пользователям-менеджерам и клиентам)*.

- `GET /api/support/:id/unread` - получение числа непрочитанных сообщений авторизованным пользователем в чате с идентификатором `ID` *(доступно только пользователям-менеджерам и клиентам)*.

- `POST /api/support/:id/read` - изменение статуса сообщений чата на 'прочитанное' в чате с идентификатором `ID` *(доступно только пользователям-менеджерам и клиентам)*. Входные данные формата `IMarkChatMessageAsReadDto` ([src/modules/support/support.interfaces.ts](src/modules/support/support.interfaces.ts#L135)):
```
{
	createdBefore: Date;
}
```


#### Валидация входных данных

Для проверки корректности критериев поиска чатов реализован валидатор `SearchSupportChatParamsDto` ([src/modules/support/validators/searchSupportChatParamsDtoValidator.ts](src/modules/support/validators/searchSupportChatParamsDtoValidator.ts)), который проверяет корректность полей `offset` и `limit` и преобразует их к типу `number`, а также поле `isActive` к типу `boolean`.


#### Контейнеры для хранения броней

Для работы с объектами типа `ISupportChat` реализованы наследники абстрактных классов:
- `SupportChatStorageFile extends StorageFile<IUSer, IUSerDto, '_id'>` - контейнер чатов на основе JSON-файла ([src/modules/support/storage/supportChatStorageFile.ts](src/modules/support/storage/supportChatStorageFile.ts));
- `SupportChatStorageDb extends StorageDb<UserDocument, IUSerDto, '_id'>` - контейнер чатов на основе БД Mongo ([src/modules/support/storage/supportChatStorageDb.ts](src/modules/support/storage/supportChatStorageDb.ts)).

В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType.

Помимо этого, добавлены специфические методы:
- `search(userId: ISupportChat['user'], isActive: boolean = undefined)` - поиск чатов по заданным критериям (ID пользователя и флагу активности чата).

Имя файла для хранения данных задается в переменной `SUPPORTCHAT_FILE`.

Для работы с БД Mongo реализована схема данных `SupportChatSchema` ([src/modules/support/storage/supportChatSchema.ts](src/modules/support/storage/supportChatSchema.ts)).


Для работы с объектами типа `IChatMessage` реализованы наследники абстрактных классов:
- `ChatMessageStorageFile extends StorageFile<IChatMessage, IChatMessageDto, '_id'>` - контейнер сообщений на основе JSON-файла ([src/modules/support/storage/chatMessageStorageFile.ts](src/modules/support/storage/chatMessageStorageFile.ts));
- `ChatMessageStorageDb extends StorageDb<ChatMessageDocument, IChatMessageDto, '_id'>` - контейнер сообщений на основе БД Mongo ([src/modules/support/storage/chatMessageStorageDb.ts](src/modules/support/storage/chatMessageStorageDb.ts)).


В этих классах реализованы обязательные методы:
- конструкторы;
- `_getNextId(id)` - получение следующего свободного значения ключевого поля ID;
- `convert(id: string)` - конвертация значения ключевого поля ID из string в требуемый IDType.

Помимо этого,добавлены специфические методы:
- `getMessagesByChat(chatId: IChatMessage['chat'])` - получение всех сообщений чата с идентификатором `chatId`;
- `getUnreadCount(chatId: IChatMessage['chat'], author: IChatMessage['author'])` - получение числа непрочитанных сообщений в чате с идентификатором `chatId`;
- `markMessagesAsRead(chatId: IChatMessage['chat'], author: IChatMessage['author'], createdBefore: Date)` - отметка сообщений о прочтении в чате с идентификатором `chatId`.

Имя файла для хранения данных задается в переменной `CHATMESSAGES_FILE`.

Для работы с БД Mongo реализована схема данных `ChatMessageSchema` ([src/modules/support/storage/chatMessageSchema.ts](src/modules/support/storage/chatMessageSchema.ts)).




### Модуль приложения

Модуль `App` импортирует имеющиеся модули `CONFIG`, `USERS`, `AUTH`, `HOTELS`, `HOTELROOMS`, `RESERVATIONS`, `SUPPORT`, `JWT`. Модуль взят из стандартного NestJS-проекта ([src/app.module.ts](src/app.module.ts)).

В принципе, файлы [src/app.controller.ts](src/app.controller.ts) и [src/app.service.ts](src/app.service.ts) не нужны. Они реализуют тестовый URL-путь `'/'` с текстом 'Hello world!'.


## Основной файл ([src/main.ts](src/main.ts))

Основной файл создает экземпляр модуля `App` и запускает сервер  [src/main.ts](src/main.ts). 

Используется библиотека `Mongoose` для работы с БД MongoDB.

Используется глобальный перехватчик Mongo-ошибок
```
app.useGlobalFilters(new MongoExceptionFilter());
```

Приложение запускается на порту `APP_PORT` (3000).



## Запуск

### Переменные окружения

Все необходимые параметры приложения задаются в переменных окружения:
- [.env](.env) - полный формат всех переменных окружения
- [mongo.env](mongo.env) - настройки для работы с БД Mongo
- [file.env](file.env) - настройки для работы с JSON-файлами

Файл сборки всех контейнеров - [Docker-compose.yml](Docker-compose.yml).

Файл сборки контейнера `meBooking` - [Dockerfile](Dockerfile).

Сам контейнер доступен по ссылке: [https://hub.docker.com/repository/docker/makevg/mebooking/general](https://hub.docker.com/repository/docker/makevg/mebooking/general).


### Запуск в режиме контейнера с использованием БД Mongo

Контейнеры для СУБД Mongo *(нужны только в режиме работы с БД Mongo)*:
- [mongo](https://hub.docker.com/_/mongo)
- [mongo-express](https://hub.docker.com/_/mongo-express)

__Порядок действий:__
1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: mongo` в файле переменных окружения (например, [mongo.env](mongo.env#L9)). 
4. В файле переменных окружения задать значение переменных `DATA_PATH` и `UPLOAD_PATH`, указав пути до папок из пп.1,2  (например, [mongo.env](mongo.env#L5)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [mongo.env](mongo.env)).
6. Задать в файле переменных окружения параметры JWT-токена (`JWT_SECRET`, `JWT_EXPIRE`)
7. Выполнить команду для запуска
```
docker compose  --env-file mongo.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file mongo.env up --build
```

#### Инициализация Mongo
В файле [mongo-init.js](mongo-init.js) содержится сценарий, создающий БД `MONGO_INITDB_DATABASE` и все необходимые коллекции (`MONGO_DATABASE_COLLECTIONS`), заданные в файле [.env](.env). Также создается пользователь `MONGO_USERNAME:MONGO_PASSWORD` для работы с БД. Данный сценарий выполняется один раз при первом запуске контейнера mongo.


### Запуск в режиме контейнера с использованием файлового хранилища

1. Создать папку для хранения данных (например, `data`).
2. Создать папку для загрузки данных (например, `public`).
3. Задать значение параметра `STORAGE_TYPE: file` в файле переменных окружения (например, [file.env](file.env#L9)). 
4. В файле переменных окружения задать значение переменных `DATA_PATH` и `UPLOAD_PATH`, указав пути до папок из пп.1,2  (например, [file.env](file.env#L5)).
5. Задать другие необходимые параметры в файле переменных окружения (например, [file.env](file.env)).
6. Задать в файле переменных окружения параметры JWT-токена (`JWT_SECRET`, `JWT_EXPIRE`)
7. Выполнить команду для запуска
```
docker compose  --env-file file.env up
```
Если в режиме сборки, то выполнить команду
```
docker compose  --env-file file.env up --build
```
Если запуск только docker-контейнера, то выполнить команду
```
docker run --name mebooking --rm -it -v ~/data:/usr/src/app/data -v ~/public:/usr/src/app/public --mount type=bind,source=d:/file.env,target=/usr/src/app/file.env,readonly  --env=ENV_FILE=./file.env -p 3000:3000 --privileged makevg/mebooking npm start 
```

### Запуск без контейнеров (только в режиме файлового хранилища)

Для запуска сервера локально без использования контейнеров необходимо выполнить команду:
- для режима отладки `npm run watch`
- для основного режима `npm run build` и потом `npm run start` 



## Проверка работы

Для проверки работоспособности можно воспользоваться:
1. Программой `PostMan`.
2. Программной `curl`.
3. В среде VSCode с установленным расширением `REST Client` с использованием файлов запросов ([test/](test/)):
	- [test/requests_user.http](test/requests_user.http),
	- [test/requests_hotel.http](test/requests_hotel.http),
	- [test/requests_reservation.http](test/requests_reservation.http),
	- [test/requests_chat.http](test/requests_chat.http),
	

### Порядок работы с файлами requests-*.http
1. **Requests_user.http**:
	1) Создать 2-3 пользователя-администратора, запомнить их ID.
	2) Создать 2-3 пользователя-менеджера, запомнить их ID.
	3) Создать 2-3 пользователя-клиента, запомнить их ID.
	4) Получить информацию о созданных пользователях, убедиться, что она корректная. Проверить работу сервера на несуществующих значениях ID.
	5) Осуществить поиск пользователей-администратора по имени/email.
	6) Осуществить поиск пользователей-менеджеров по имени/email, использую параметры запроса offset и limit.
	7) Проверить работу аутентификации с корректными и некорректными парами логин-пароль.
	8) Проверить работу аутентификации при отсутствии логина и/или пароля.
	9) Получить токены администратора, менеджера, клиента. Запомнить их *(они пригодятся позднее)*. 
2. **Requests_hotel.http**:
	1) Создать 2-3 гостиницы с использованием токена администратора (см. п.1.9). Запомнить их ID.
	2) Проверить создание гостиницы без токена или с токеном менеджера/клиента (см. п.1.9).
	3) Добавить по 2-3 номера к 2-м гостиницам с использованием токена менеджера.
	4) Получить список гостиниц и проверить его корректность.
	5) Получить список комнат в гостиницах (ID из п.2.1), в том числе в пустых гостиницах. Проверить корректность результатов. Проверить работу параметров offset и limit. 
	6) Посмотреть информацию о конкретных номерах (ID номеров из п.2.3). Проверить результаты работы при некорректном ID.
	7) Изменить названием гостиниц из п.2.1 от имени администратора/менеджера. Проверить корректность работы токенов.
	8) Изменить статус 1-2 номеров на неактивный (isEnabled=false). Проверить результаты поиска номеров по связанной гостинице.
	9) Осуществить поиск гостиниц и номеров по критериям поиска.
3. **Requests_reservation.http**:
	1) Создать брони к 2-3 номерам (см. п.2.3) от имени 1-2 клиентов (см. п. 1.9). Запомнить их ID.
	2) Получить список всех броней от имени менеджера. Убедиться в его корректности.
	3) Получить список броней отдельного клиента. Убедиться в его корректности. 
	4) Просмотреть информацию о конкретной брони (см. п.3.1).
	5) Добавить еще одну бронь клиенту так, чтобы даты не пересекались.
	6) Добавить бронь клиенту так, чтобы даты захватывали уже имеющиеся.
	7) Изменить существующую бронь так, чтобы новые даты захватывали уже имеющуюся.
	8) Удалить бронь, созданную в п.3.5.
	9) Повторить пп.6,7. Убедиться в корректности их работы.
4. **Requests_chat.http**:
	1) Создать 2-3 чата от имени 1-2 клиентов (см. п.1.9). Запомнить их ID.
	2) Отправить еще 2-3 сообщения в созданные чаты от имени клиентов.
	3) Отправить 1-2 сообщения в чаты от имени менеджеров (см. п.1.9).
	4) Получить список всех чатов. Проверить работу параметров offset и limit.
	5) Получить список чатов выбранного клиента. Проверить его корректность.
	6) Посмотреть содержимое чатов, созданных в п.4.1. Проверить наличие всех отправленных сообщений.
	7) Получить число непрочитанных сообщений в чатах, созданных в п.4.1.
	8) Изменить статус сообщений на 'прочитанные' от имени менеджера.
	9) Получить еще раз число непрочитанных сообщений. Сравнить результаты с результатами из п.4.7.
	10) Закрыть чат (isActive=false). Получить информацию о чате (см. п.4.6).

	






# Задание
[https://github.com/netology-code/ndjs-diplom](https://github.com/netology-code/ndjs-diplom)