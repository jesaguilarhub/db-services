import db from '../services/db.services.js';
import faker from 'faker';

describe('Servicio findAll de DB', () => {
	beforeAll(async () => {
		await db.clear(); //Limpiar la DB
		await db.populateDB(10); //Agregar 10 registros en la DB
	});

	it('Debería obtener un arreglo', async () => {
		const users = await db.findAll();

		expect(users).toEqual(expect.any(Array));
	});

	it('Debería de tener 10 elementos en el arreglo', async () => {
		const users = await db.findAll();

		expect(users.length).toBe(10);
	});
});

describe('Servicio findById', () => {
	let users = [];

	beforeAll(async () => {
		await db.clear(); //Limpiar la DB
		users = await db.populateDB(10); //Agregar 10 registros en la DB
	});

	it('Debería de obtener un objeto', async () => {
		const usersObj = await db.findById(1);

		expect(usersObj).not.toEqual(expect.any(Array));
		expect(usersObj).toEqual(expect.any(Object));
	});

	it('Debería de obtener un objeto de tipo user', async () => {
		const userObj = await db.findById(1);

		expect(Object.keys(userObj)).toEqual(
			expect.arrayContaining([
				'id',
				'firstname',
				'lastname',
				'email'
			])
		);
	});

	it('Debería de obtener un usuario por id', async () => {
		const userObj = await db.findById(2);
		const userValues = Object.values(users[1]);

		expect(Object.values(userObj)).toEqual(expect.arrayContaining(userValues));
	});
});

describe('Servicio create', () => {
	let newUser = {};

	beforeEach(async () => {
		await db.clear(); //Limpiar la DB

		newUser = {
			id        : 10,
			firstname : faker.name.firstName(),
			lastname  : faker.name.lastName(),
			email     : faker.internet.email().toLowerCase()
		};
	});

	it('Debería de regresar un objeto de tipo user', async () => {
		const userCreated = await db.create(newUser);

		expect(Object.keys(userCreated)).toEqual(
			expect.arrayContaining([
				'id',
				'firstname',
				'lastname',
				'email'
			])
		);
	});

	it('Debería de regresar un objeto de tipo user con los valores que se acaban de agregar', async () => {
		const userCreated = await db.create(newUser);
		//Obtener el usuario que se agrego en la DB
		const userObj = await db.findById(userCreated.id);

		expect(Object.values(userCreated)).toEqual(expect.arrayContaining(Object.values(userObj)));
	});
});

describe('Servicio update', () => {
	let newUser = {};
	let userCreated = {};

	beforeEach(async () => {
		await db.clear(); //Limpiar la DB

		newUser = {
			id        : 12,
			firstname : faker.name.firstName(),
			lastname  : faker.name.lastName(),
			email     : faker.internet.email().toLowerCase()
		};

		userCreated = await db.create(newUser); //Crear un nuevo usuario
	});

	it('Debería de regresar un objeto de tipo User al actualizar', async () => {
		const userObj = await db.update(
			{
				firstname : faker.name.firstName(),
				lastname  : faker.name.lastName(),
				email     : faker.internet.email().toLowerCase()
			},
			12
		);
		expect(Object.keys(userObj)).toEqual(
			expect.arrayContaining([
				'id',
				'firstname',
				'lastname',
				'email'
			])
		);
	});

	it('Debería de regresar un objeto de tipo User con los valores que se acaban de actualizar', async () => {
		const userUpdate = {
			firstname : faker.name.firstName(),
			lastname  : faker.name.lastName(),
			email     : faker.internet.email().toLowerCase()
		};
		const updated = await db.update(userUpdate, 12);
		expect(Object.values(updated)).toEqual(expect.arrayContaining(Object.values(userUpdate)));
	});

	it('Debería de arrojar un error al tratar de actualizar un usuario que no existe en la DB', () => {
		expect(async () => await db.update({}, Date.now)).toThrow();
	});
});

describe('Servicio delete', () => {
	let newUser = {};
	let userCreated = {};

	beforeEach(async () => {
		await db.clear(); //Limpiar la DB

		newUser = {
			id        : 13,
			firstname : faker.name.firstName(),
			lastname  : faker.name.lastName(),
			email     : faker.internet.email().toLowerCase()
		};

		userCreated = await db.create(newUser); //Crear un nuevo usuario
	});

	it('Debería de regresar true al eliminar un usuario', async () => {
		const isUserDeleted = await db.delete(userCreated.id);

		expect(isUserDeleted).toBe(true);
	});

	it('Debería de regresar false al tratar de eliminar un usuario con un id que no existe en la DB', async () => {
		const isUserDeleted = await db.delete(Date.now());
		expect(isUserDeleted).toBe(false);
	});
});
