import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export interface TuitionI {
  id?: number;
  registrationDate: Date;
  city: string;
  payment: number;
  car_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Tuition extends Model implements TuitionI {

  public id!: number;
  public registrationDate!: Date;
  public city!: string;
  public payment!: number;
  public car_id!: number;
  public status!: "ACTIVE" | "INACTIVE";

}

Tuition.init(
  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Registration date must be valid",
        },
      },
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City cannot be empty",
        },
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
        isDecimal: {
          msg: "Payment must be decimal",
        },
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
        isInt: {
          msg: "Car ID must be an integer",
        },
      },
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

  },
  {
    sequelize,
    modelName: "Tuition",
    tableName: "tuitions",
    timestamps: false,
  }
);