import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Tuition } from "./Tuition";

export interface CarI {
  id?: number;
  brand: string;
  class: string;
  model: string;
  cylinderCapacity: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Car extends Model {
  public id!: number;
  public brand!: string;
  public class!: string;
  public model!: string;
  public cylinderCapacity!: number;
  public capacity!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Car.init(
  {
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Brand cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Brand must contain between 2 and 100 characters",
        },
      },
    },

    class: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Class cannot be empty" },
      },
    },

    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Model cannot be empty" },
      },
    },

    cylinderCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Cylinder capacity must be an integer" },
        min: {
          args: [50],
          msg: "Cylinder capacity must be greater than 50",
        },
      },
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "Capacity must be an integer" },
        min: {
          args: [1],
          msg: "Capacity must be greater than 0",
        },
      },
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Car",
    tableName: "cars",
    timestamps: false,
  }
);

Car.hasMany(Tuition, {
  foreignKey: "car_id",
  sourceKey: "id",
});

Tuition.belongsTo(Car, {
  foreignKey: "car_id",
  targetKey: "id",
});