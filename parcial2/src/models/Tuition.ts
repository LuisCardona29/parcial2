import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { Car } from "./car";

export interface TuitionI {
  id?: number;
  registrationDate: Date;
  city: string;
  payment: number;
  car_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Tuition extends Model {
  public id!: number;
  public registrationDate!: Date;
  public city!: string;
  public payment!: number;
  public car_id!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Tuition.init(
  {
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { args: true, msg: "Registration date must be valid" },
      },
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "City cannot be empty" },
        len: {
          args: [2, 100],
          msg: "City must contain between 2 and 100 characters",
        },
      },
    },

    payment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Payment must be decimal" },
        min: {
          args: [0],
          msg: "Payment cannot be negative",
        },
      },
    },

    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cars",
        key: "id",
      },
      validate: {
        isInt: { msg: "Car ID must be an integer" },
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
    modelName: "Tuition",
    tableName: "tuitions",
    timestamps: false,
  }
);

Tuition.belongsTo(Car, {
  foreignKey: "car_id",
  targetKey: "id",
});

Car.hasMany(Tuition, {
  foreignKey: "car_id",
  sourceKey: "id",
});