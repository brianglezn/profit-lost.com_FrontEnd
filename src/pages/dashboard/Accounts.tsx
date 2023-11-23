import React, { useEffect, useState, useMemo } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  Modal,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Accounts.css";
import dataAccountsFile from "../../data/dataAccounts.json";
import AccountItem from "../../components/dashboard/AccountItem.tsx";
import FormAccounts from "../../components/dashboard/FormAccounts.tsx";

// Creamos un tipo para los elementos de datos de la cuenta.
type DataAccountItem = {
  accountName: string;
  data: {
    [year: string]:
    | {
      [month: string]: number | undefined;
    }
    | undefined;
  };
  customBackgroundColor: string;
  customColor: string;
};

// Array de nombres de los meses
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// Función para obtener el nombre del mes anterior.
function getPreviousMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  return monthNames[previousMonth];
}

function Accounts() {
  // Estado para rastrear si hay datos disponibles
  const [isDataAvailable, setIsDataAvailable] = useState(true);

  // Hook de estado para manejar los datos de las cuentas
  const [dataAccounts, setDataAccounts] = useState<DataAccountItem[]>([]);
  // Hook de efecto para formatear y establecer datos de las cuentas a partir de un archivo de datos
  useEffect(() => {
    const formattedData = dataAccountsFile.map((item: DataAccountItem) => {
      // Inicializa el objeto de datos formateados para un año
      const formattedData: Record<string, Record<string, number>> = {};

      // Itera sobre cada año en los datos de la cuenta
      for (const year in item.data) {
        if (item.data[year]) {
          // Inicializa el objeto de datos mensuales para un año específico
          const monthlyData: Record<string, number> = {};
          // Itera sobre cada mes en los datos del año
          for (const month in item.data[year]) {
            const value = item.data[year]?.[month];
            if (typeof value === "number") {
              // Si el valor es un número, lo añade al objeto de datos mensuales
              monthlyData[month] = value;
            }
          }
          // Añade los datos mensuales formateados al objeto de datos del año
          formattedData[year] = monthlyData;
        }
      }

      // Devuelve un nuevo objeto con los datos formateados y las propiedades de estilo
      return {
        accountName: item.accountName,
        data: formattedData,
        customBackgroundColor: item.customBackgroundColor,
        customColor: item.customColor,
      };
    });

    setDataAccounts(formattedData);
  }, []);

  // Extrae la fecha actual, el año actual y el nombre del mes actual
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonthName: string = monthNames[currentDate.getMonth()];

  // Hook useMemo para calcular el saldo total actual basándose en los datos de las cuentas y el mes actual
  const totalBalance = useMemo(() => {
    let hasData = false;
    const balance = dataAccounts.reduce((acc, account) => {
      const monthBalance = account.data[currentYear]?.[currentMonthName] || 0;
      if (monthBalance !== 0) hasData = true;
      return acc + monthBalance;
    }, 0);
    // Actualiza el estado basándose en si encontramos algún saldo para el mes actual
    setIsDataAvailable(hasData);
    return balance;
  }, [dataAccounts, currentYear, currentMonthName]);

  const uniqueYears = useMemo(() => {
    // Crea un conjunto de años para eliminar duplicados y luego lo convierte en un array ordenado
    return Array.from(
      new Set(dataAccounts.flatMap((account) => Object.keys(account.data)))
    ).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [dataAccounts]);

  // Hook de estado y función manejadora para el cambio de año seleccionado en la interfaz de usuario
  const [year, setYear] = React.useState(currentYear.toString());
  const handleChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  // Genera los datos para el gráfico a partir de los datos de las cuentas y el año seleccionado
  const chartData = monthNames.map((month) => {
    const data: Record<string, number> = { "TOTAL": 0 };

    dataAccounts.forEach((account) => {
      // Obtiene el valor para el mes y año seleccionados o 0 si no está definido
      const value = account.data[parseInt(year)]?.[month] ?? 0;
      // Asigna el valor al nombre de la cuenta correspondiente en el objeto de datos
      data[account.accountName] = value;
      // Acumula el valor en el total
      data["TOTAL"] += value;
    });

    // Devuelve un objeto con el nombre del mes y los datos acumulados de todas las cuentas
    return {
      name: month,
      ...data,
    };
  });

  // Formatea el saldo total para mostrarlo en el formato de moneda local
  const formattedTotalBalance = totalBalance.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Obtiene el nombre del mes anterior para calcular la diferencia de saldo
  const previousMonth = getPreviousMonth();

  // Hook useMemo para calcular la diferencia de saldo entre el mes actual y el anterior
  const balanceDifference = useMemo(() => {
    // Calcula el saldo del mes actual sumando los saldos de todas las cuentas
    const currentMonthBalance = dataAccounts.reduce((total, account) => {
      return total + (account.data[currentYear]?.[currentMonthName] || 0);
    }, 0);
    // Calcula el saldo del mes anterior sumando los saldos de todas las cuentas
    const previousMonthBalance = dataAccounts.reduce((total, account) => {
      return total + (account.data[currentYear]?.[previousMonth] || 0);
    }, 0);
    // Devuelve la diferencia entre el saldo actual y el anterior
    return currentMonthBalance - previousMonthBalance;
  }, [dataAccounts, currentYear, currentMonthName, previousMonth]);
  const isPositive = balanceDifference > 0;

  // Hook useMemo para generar elementos de la cuenta para la interfaz de usuario
  const accountItems = useMemo(() => {
    // Mapea los datos de las cuentas para crear un elemento de cuenta para cada uno
    return dataAccounts.map((account, index) => (
      <AccountItem
        key={index}
        accountName={account.accountName}
        balance={`${account.data[currentYear]?.[currentMonthName]?.toLocaleString(
          "es-ES",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ) ?? "N/A"
          } €`}
        customBackgroundColor={account.customBackgroundColor}
        customColor={account.customColor}
      />
    ));
  }, [dataAccounts, currentYear, currentMonthName]);

  // Modal
  const styleBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "var(--color-bg)",
    boxShadow: 15,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px"
  };

  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const backdropStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(4px)',
  };

  return (
    <>
      <section className="accounts">
        <div className="movements__containerMain">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              {uniqueYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {isDataAvailable ? (
            <div className="accounts__main">

              <h2>{formattedTotalBalance} €</h2>
              <p className={isPositive ? "positive-balance" : "negative-balance"}>
                {balanceDifference > 0
                  ? `+${balanceDifference.toFixed(2)}`
                  : balanceDifference.toFixed(2)}{" "}
                € <span>{previousMonth}</span>
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {dataAccounts.map((account) => (
                    <Bar
                      key={account.accountName}
                      dataKey={account.accountName}
                      stackId="a"
                      fill={account.customBackgroundColor}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>) : (
            <p>No data available for the current year.</p>
          )}

        </div>
        <div className="accounts__containerAccounts">
          <div className="accounts__accounts-text">
            <p>Accounts</p>
            <span className="material-symbols-rounded" onClick={handleOpenModal}>new_window</span>
            <Modal
              open={open}
              onClose={handleCloseModal}
              componentsProps={{
                backdrop: {
                  style: backdropStyle,
                },
              }}>
              <Box sx={styleBox}>
                <FormAccounts onClose={handleCloseModal} />
              </Box>
            </Modal>
          </div>
          <div className="accounts__accounts-container">{accountItems}</div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
