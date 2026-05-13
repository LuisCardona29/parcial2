# Manual Completo del Proyecto Node.js con Sequelize

## Introducción

Este documento contiene el desarrollo completo del proyecto backend utilizando Node.js, Express, Sequelize y múltiples motores de bases de datos.

---

Creacion de modelos

Este fue el prom que utilice en la IA Chatgpt 
créame los modelos de Node. js con relaciones incluidas (no hagas relaciones circulares por favor) adaptados al siguiente ejemplo, todos los modelos deben correr en cualquiera de los 4 motores (oracle, mysql, sql server, postgres) y deben tener un status para seleccionar active o inactive, esto para manejar el borrado lógico, los crearás en inglés y con I mayúscula al final, cuando haya una relación de muchos a muchos, crea una tabla puente donde solo lleguen ambos ids y el campo de status, las relaciones no las hagas por medio de un archivo associations, ah y tambien agregale validaciones y restricciones, las quiero tal como en el ejemplo:

import { DataTypes, Model } from "sequelize";

import { sequelize } from "../database/db";

import bcrypt from 'bcryptjs';

import { Sale } from "./Sale";

export interface ClientI {

id?: number;

name: string;

address: string;

phone: string;

email: string;

password: string;

status: "ACTIVE" | "INACTIVE";

}

export class Client extends Model {

public id!: number;

public name!: string;

public address!: string;

public phone!: string;

public email!: string;

public password!: string;

public status!: "ACTIVE" | "INACTIVE";

}

Client.init(

{

name: {

type: DataTypes.STRING,

allowNull: true,

},

address: {

type: DataTypes.STRING,

allowNull: true,

},

phone: {

type: DataTypes.STRING,

allowNull: true,

validate: {

notEmpty: { msg: "Phone cannot be empty" },

},

},

email: {

type: DataTypes.STRING,

allowNull: true,

unique: true,

validate: {

isEmail: { msg: "Email must be a valid email address" }, // Validate email format

},

},

password: {

type: DataTypes.STRING,

allowNull: true,

},

status: {

type: DataTypes.ENUM("ACTIVE", "INACTIVE"),

defaultValue: "ACTIVE",

},

},

{

sequelize,

modelName: "Client",

tableName: "clients",

timestamps: false,

hooks: {

beforeCreate: async (client: Client) => {

if (client.password) {

const salt = await bcrypt.genSalt(10);

client.password = await bcrypt.hash(client.password, salt);

}

},

beforeUpdate: async (client: Client) => {

if (client.password) {

const salt = await bcrypt.genSalt(10);

client.password = await bcrypt.hash(client.password, salt);

}

}

}

}

);

Client.hasMany(Sale, {

foreignKey: "client_id",

sourceKey: "id",

});

Sale.belongsTo(Client, {

foreignKey: "client_id",

targetKey: "id",

});

Y la respuesta que me dio fue los modelos creados anteriormente

Y este el link del primer commit 1edee7d1c5d031913dfb9eccbf6768a5937d8ad9

Creacion de los controladores:

El prom que utilice para los controladores es este 
hazme los controladores de mis modelos en base a este ejemplo, ten en cuenta que ahora los archivos de controladores se llaman modelo.controller.ts, ejemplo: client.controller.ts

import { Request, Response } from "express";

import { Client, ClientI } from "../models/persons/Client";

export class ClientController {

public async getAllClients(req: Request, res: Response) {

try {

const clients: ClientI[] = await Client.findAll({ where: { status: "ACTIVE" } });

res.status(200).json({ clients });

} catch (error) {

res.status(500).json({ error: "Error fetching clients" });

}

}

public async getClientById(req: Request, res: Response) {

try {

const { id: pk } = req.params;

const client = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });

if (client) {

res.status(200).json({ client });

} else {

res.status(404).json({ error: "Client not found or inactive" });

}

} catch (error) {

res.status(500).json({ error: "Error fetching client" });

}

}

public async createClient(req: Request, res: Response) {

const { doc_type, doc_number, name, phone, email, status } = req.body;

try {

const body: ClientI = { doc_type, doc_number, name, phone, email, status };

const newClient = await Client.create({ ...body });

res.status(201).json(newClient);

} catch (error: any) {

res.status(400).json({ error: error.message });

}

}

public async updateClient(req: Request, res: Response) {

const { id: pk } = req.params;

const { doc_type, doc_number, name, phone, email, status } = req.body;

try {

const body: ClientI = { doc_type, doc_number, name, phone, email, status };

const clientExist = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });

if (clientExist) {

await clientExist.update(body, { where: { id: pk } });

res.status(200).json(clientExist);

} else {

res.status(404).json({ error: "Client not found or inactive" });

}

} catch (error: any) {

res.status(400).json({ error: error.message });

}

}

public async deleteClient(req: Request, res: Response) {

try {

const { id: pk } = req.params;

const clientToDelete = await Client.findOne({ where: { id: pk } });

if (clientToDelete) {

await clientToDelete.destroy();

res.status(200).json({ message: "Client deleted successfully" });

} else {

res.status(404).json({ error: "Client not found" });

}

} catch (error) {

res.status(500).json({ error: "Error deleting client" });

}

}

public async deleteClientAdv(req: Request, res: Response) {

try {

const { id: pk } = req.params;

const clientToUpdate = await Client.findOne({ where: { id: pk, status: "ACTIVE" } });

if (clientToUpdate) {

await clientToUpdate.update({ status: "INACTIVE" });

res.status(200).json({ message: "Client marked as inactive" });

} else {

res.status(404).json({ error: "Client not found or inactive" });

}

} catch (error) {

res.status(500).json({ error: "Error marking client as inactive" });

}

}

}

Y como respuesta fue los controladores creados anteriormente

Link del segundo commit 39d7016e4c27e66bc46c093cee54460657a2cfb3

Creacion de las rutas:

Prom que utilice fue

ahora creame las rutas de mis modelos adaptadas al siguiente ejemplo, ten en cuenta que las rutas no son modelo.route.ts. solo modelo.ts

import { Application } from "express";

import { CategoryController } from "../controllers/inventories/category.controller";

export class CategoryRoutes {

public controller = new CategoryController();

public routes(app: Application): void {

app.route("/api/category/public")

.get(this.controller.getAllCategories)

.post(this.controller.createCategory);

app.route("/api/category/public/:id")

.get(this.controller.getCategoryById)

.patch(this.controller.updateCategory)

.delete(this.controller.deleteCategory);

app.route("/api/category/public/:id/logic")

.delete(this.controller.deleteCategoryAdv);

}

}

Y como respuesta fue la creación de las rutas

Y el link del commit es d7233c9a838346fc4a9316c1294b7025fae932ed

Index de rutas

Index config

Link del commit 75f87b7b94840de30b36f0b7628960ba8a09d415

Creacion de la base de datos:

postgrest

Ahora en sql server

Creación y validación del faker

Utilice este prom

Ahora necesito que me ayudes a crear un faker que genere minimo 20 datos en cada modelo y tambien quiero que se ejecute al momento que ejecute el npm run dev y guiate de este ejemplo

import { Client } from '../models/Client';

import { ProductType } from '../models/ProductType';

import { Product } from '../models/Product';

import { Sale } from '../models/Sale';

import { ProductSale } from '../models/ProductSale';

import { faker } from '@faker-js/faker';

async function createFakeData() {

// Crear clientes falsos

for (let i = 0; i < 50; i++) {

await Client.create({

name: faker.person.fullName(),

address: faker.location.streetAddress(),

phone: faker.phone.number(), // Genera un número de teléfono aleatorio

email: faker.internet.email(),

password: faker.internet.password(),

status: 'ACTIVE',

});

}

// Crear tipos de productos falsos

for (let i = 0; i < 10; i++) {

await ProductType.create({

name: faker.commerce.department(),

description: faker.commerce.productDescription(),

status: 'ACTIVE',

});

}

// Crear productos falsos

const typeProducts = await ProductType.findAll();

for (let i = 0; i < 20; i++) {

await Product.create({

name: faker.commerce.productName(),

brand: faker.company.name(),

price: faker.number.bigInt(),

min_stock: faker.number.int({ min: 1, max: 10 }),

quantity: faker.number.int({ min: 1, max: 100 }),

product_type_id: typeProducts.length > 0

? typeProducts[faker.number.int({ min: 0, max: typeProducts.length - 1 })]?.id

: null,

status: 'ACTIVE',

});

}

// Crear ventas falsas

const clients = await Client.findAll();

for (let i = 0; i < 100; i++) {

await Sale.create({

sale_date: faker.date.past(),

subtotal: faker.number.bigInt(),

tax: faker.number.bigInt(),

discounts: faker.number.bigInt(),

total: faker.number.bigInt(),

status: 'ACTIVE',

client_id: clients.length > 0

? clients[faker.number.int({ min: 0, max: clients.length - 1 })]?.id ?? null

: null

});

}

//     // Crear productos ventas falsos

const sales = await Sale.findAll();

const products = await Product.findAll();

for (let i = 0; i < 200; i++) {

await ProductSale.create({

total: faker.number.bigInt(),

sale_id: sales[faker.number.int({ min: 0, max: sales.length - 1 })]?.id ?? null,

product_id: products[faker.number.int({ min: 0, max: products.length - 1 })]?.id ?? null

});

}

}

createFakeData().then(() => {

console.log('Datos falsos creados exitosamente');

}).catch((error) => {

console.error('Error al crear datos falsos:', error);

});

Ahora en postgrest

Creacion y validación de los http

---

# Evidencias Visuales del Proyecto

## Evidencia 1

![Evidencia 1](imagenes/image1.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 2

![Evidencia 2](imagenes/image2.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 3

![Evidencia 3](imagenes/image3.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 4

![Evidencia 4](imagenes/image4.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 5

![Evidencia 5](imagenes/image5.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 6

![Evidencia 6](imagenes/image6.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 7

![Evidencia 7](imagenes/image7.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 8

![Evidencia 8](imagenes/image8.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 9

![Evidencia 9](imagenes/image9.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 10

![Evidencia 10](imagenes/image10.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 11

![Evidencia 11](imagenes/image11.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 12

![Evidencia 12](imagenes/image12.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 13

![Evidencia 13](imagenes/image13.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 14

![Evidencia 14](imagenes/image14.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 15

![Evidencia 15](imagenes/image15.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 16

![Evidencia 16](imagenes/image16.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 17

![Evidencia 17](imagenes/image17.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 18

![Evidencia 18](imagenes/image18.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 19

![Evidencia 19](imagenes/image19.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 20

![Evidencia 20](imagenes/image20.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 21

![Evidencia 21](imagenes/image21.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 22

![Evidencia 22](imagenes/image22.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 23

![Evidencia 23](imagenes/image23.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 24

![Evidencia 24](imagenes/image24.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 25

![Evidencia 25](imagenes/image25.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 26

![Evidencia 26](imagenes/image26.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 27

![Evidencia 27](imagenes/image27.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 28

![Evidencia 28](imagenes/image28.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 29

![Evidencia 29](imagenes/image29.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 30

![Evidencia 30](imagenes/image30.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 31

![Evidencia 31](imagenes/image31.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 32

![Evidencia 32](imagenes/image32.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 33

![Evidencia 33](imagenes/image33.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 34

![Evidencia 34](imagenes/image34.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 35

![Evidencia 35](imagenes/image35.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 36

![Evidencia 36](imagenes/image36.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 37

![Evidencia 37](imagenes/image37.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 38

![Evidencia 38](imagenes/image38.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 39

![Evidencia 39](imagenes/image39.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 40

![Evidencia 40](imagenes/image40.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 41

![Evidencia 41](imagenes/image41.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 42

![Evidencia 42](imagenes/image42.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 43

![Evidencia 43](imagenes/image43.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 44

![Evidencia 44](imagenes/image45.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 45

![Evidencia 45](imagenes/image46.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 46

![Evidencia 46](imagenes/image47.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 47

![Evidencia 47](imagenes/image48.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 48

![Evidencia 48](imagenes/image49.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 49

![Evidencia 49](imagenes/image50.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 50

![Evidencia 50](imagenes/image44.png)

Imagen correspondiente al proceso documentado en el proyecto.

---

## Evidencia 51

![Evidencia 51](imagenes/image51.png)

Imagen correspondiente al proceso documentado en el proyecto.

---
