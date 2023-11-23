import http from "node:http";
import fs from "node:fs/promises";
import { sendData, sendError } from "./modules/send.js"; // дописать ручками .js
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080; //можно занять любой
export const COMEDIANS = "./comedians.json";
export const CLIENTS = "./clients.json";

const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "*"); //разрешаем всем адресам сайтов делать запросы

        const segments = req.url.split("/").filter(Boolean); // убирает первый пустой ""

        if (req.method === "GET" && segments[0] === "comedians") {
          handleComediansRequest(req, res, comedians, segments);
          return;
        }

        if (req.method === "POST" && segments[0] === "clients") { // Добавление клиента
          handleAddClient(req, res);
          return;          
        }

        if ( // Получение клиента по номеру билета
          req.method === "GET" &&
          segments[0] === "clients" &&
          segments.length === 2
        ) {
          const ticketNumber = segments[1];
          handleClientsRequest(req, res, ticketNumber);
          return;
        }

        if (  // Обновление клиента по номеру билета
          req.method === "PATCH" &&
          segments[0] === "clients" &&
          segments.length === 2
        ) {
          handleUpdateClient(req, res, segments);
          return;
        }

        
        sendError(res, 404, "Страница не найдена");
      } catch (error) {
        sendError(res, 500, `Ошибка сервера: ${error}`);
      }
    })
    .listen(PORT);

  console.log(`Сервер запущен на http://localhost:${PORT}`);
};
startServer();
