import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleUpdateClient = (req, res, segments) => {
  let body = "";
  const ticketNumber = segments[1];
  try {
    req.on("data", (chunk) => {
      body += chunk;
    });
  } catch (error) {
    console.log(`Ошибка при чтении запроса`);
    sendError(res, 500, "Ошибка сервера при чтении запроса");
  }

  req.on("end", async () => {
    try {
      const updateDataClient = JSON.parse(body);

      if (
        //проверим наличие всех полей
        !updateDataClient.fullName ||
        !updateDataClient.phone ||
        !updateDataClient.ticketNumber ||
        !updateDataClient.booking
      ) {
        sendError(res, 400, "Неверные основные данные клиента");
        return;
      }

      if (
        updateDataClient.booking && // поле booking есть, то проверяем:
        (!updateDataClient.booking.length || // что в нем есть элементы
          !Array.isArray(updateDataClient.booking) || // что он является массивом
          !updateDataClient.booking.every((item) => item.comedian && item.time)) // что каждый элемент существует
      ) {
        sendError(res, 400, "Неверно заполнены поля бронирования");
        return;
      }

      const clientData = await fs.readFile(CLIENTS, "utf-8");
      const clients = JSON.parse(clientData);

      const clientIndex = clients.findIndex(
        (c) => c.ticketNumber === ticketNumber
      );

      if (clientIndex === -1) {
        sendError(res, 404, "Клиент с данным номером билета не найден");
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateDataClient,
      };


      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`error: ${error}`);
      sendError(res, 500, "Ошибка сервера при обновлении данных");
    }
  });
};
