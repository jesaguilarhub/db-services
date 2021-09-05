import fs from 'fs/promises';
import path from 'path';
import faker from 'faker';

class AcademloDb {
	static dbPath = path.resolve('db', 'db.json');

	static findAll = async () => {
		try {
			let data = await fs.readFile(this.dbPath, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			throw new Error('Hubo un error al tratar de obtener todos los registros de la DB');
		}
	};

	static writeAll = async (dbPath, data) => {
		try {
			await fs.writeFile(dbPath, data);
		} catch (e) {
			throw e;
		}
	};
	static findById = async (id) => {
		const users = await this.findAll();
		return users.find((user) => user.id === id);
	};

	static create = async (obj) => {
		const users = await this.findAll();
		users.push(obj);
		await this.writeAll(this.dbPath, JSON.stringify(users));
		return users.pop();
	};

	static update = async (obj, id) => {
		const users = await this.findAll();
		const idx = users.findIndex((user) => user.id === id);

		if (idx < 0) throw new Error();

		users[idx] = { id, ...obj };
		await this.writeAll(this.dbPath, JSON.stringify(users));
		return users[idx];
	};

	static delete = async (id) => {
		const users = await this.findAll();
		if (users.findIndex((user) => user.id === id) < 0) return false;

		const updated = users.filter((user) => user.id !== id);

		await this.writeAll(this.dbPath, JSON.stringify(updated));

		return true;
	};

	static clear = async () => {
		try {
			await fs.writeFile(this.dbPath, JSON.stringify([]));
		} catch (error) {
			throw new Error('Hubo un error al tratar de vaciar la DB');
		}
	};

	static populateDB = async (size) => {
		let userArr = [];
		for (let i = 0; i < size; i++) {
			let userObj = {
				id        : i + 1,
				firstname : faker.name.firstName(),
				lastname  : faker.name.lastName(),
				email     : faker.internet.email().toLowerCase()
			};

			userArr.push(userObj);
		}

		try {
			await fs.writeFile(this.dbPath, JSON.stringify(userArr));
			return userArr;
		} catch (error) {
			throw new Error('Hubo un error al insertar en la base de datos');
		}
	};
}

export default AcademloDb;
