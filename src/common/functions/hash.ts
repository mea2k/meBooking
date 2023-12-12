import * as bcrypt from 'bcrypt';


/** ПОЛУЧЕНИЕ РАСШИРЕННОЙ ПАРОЛЬНОЙ СТРОКИ
 *  (для последующей генерации хеш-строки)
 * @constructor
 * @params login     - имя пользователя
 * @params password  - пароль
 * @params secret	 - добавляемый суффикс ('')
 *
 * @returns string
 */
function _generatePasswordString(login: string, password: string, secret = ''): string {
	return login + ':' + password + ':' + secret;
}


/** ПОЛУЧЕНИЕ ХЕШ-СТРОКИ ОТ ПАРОЛЯ
 * (используется при авторизации)
 * @constructor
 * @params login     - имя пользователя
 * @params password  - хэшируемый пароль
 * @params rounds	 - число раундов генерации (10)
 *
 * @returns HASH: string or NULL
 */
export async function hashPassword(login: string, password: string, rounds = 10) {
	try {
		// получение расширенной парольной строки
		const data = _generatePasswordString(login, password);
		// Hash password
		return await bcrypt.hash(data, rounds);
	} catch (error) {
		console.log(error);
	}

	// Return null if error
	return null;
}


/** СРАВНЕНИЕ ПАРОЛЯ И ХЕШ-СТРОКИ
 * (используется при авторизации)
 * @constructor
 * @params login     - имя пользователя
 * @params password  - проверяемый пароль аутентификации
 * @params hash      - хеш пароля (из хранилища)
 * @params rounds	 - число раундов генерации (10)
 *
 * @returns TRUE или FALSE
 */
export async function compareHash(login: string, password: string, hash: string, rounds = 10) {
	try {
		// получение расширенной парольной строки
		const data = _generatePasswordString(login, password);
		const res = await bcrypt.compare(data, hash);
		return res;
	} catch (error) {
		console.log(error);
	}

	// Return FALSE if error
	return false;
}

