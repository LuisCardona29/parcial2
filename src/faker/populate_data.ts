import { faker } from "@faker-js/faker";

import { Car } from "../models/Car";
import { Tuition } from "../models/Tuition";

export async function populateData(): Promise<void> {

  try {

    /* VERIFY IF DATA ALREADY EXISTS */

    const carsCount = await Car.count();

    if (carsCount > 0) {

      console.log("⚠️ Fake data already exists");

      return;

    }

    console.log("🌱 Creating fake data...");

    /* CREATE CARS */

    for (let i = 0; i < 20; i++) {

      await Car.create({

        brand: faker.vehicle.manufacturer(),

        class: faker.helpers.arrayElement([
          "SUV",
          "SEDAN",
          "SPORT",
          "PICKUP",
          "HATCHBACK"
        ]),

        model: faker.vehicle.model(),

        cylinderCapacity: faker.number.int({
          min: 1000,
          max: 5000
        }),

        capacity: faker.number.int({
          min: 2,
          max: 8
        }),

        status: "ACTIVE"

      });

    }

    console.log("✅ Cars created");

    /* GET ALL CARS */

    const cars = await Car.findAll();

    /* CREATE TUITIONS */

    for (let i = 0; i < 20; i++) {

      await Tuition.create({

        registrationDate: faker.date.past(),

        city: faker.location.city(),

        payment: faker.number.float({
          min: 100000,
          max: 1000000,
          fractionDigits: 2
        }),

        car_id:
          cars[
            faker.number.int({
              min: 0,
              max: cars.length - 1
            })
          ]?.id,

        status: "ACTIVE"

      });

    }

    console.log("✅ Tuitions created");

    console.log("🌱 Fake data generated successfully");

  } catch (error) {

    console.error("❌ Error creating fake data:", error);

  }

}