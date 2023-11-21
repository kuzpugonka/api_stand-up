import http from "node:http";
import fs from "node:fs/promises";

const PORT = 8080; //можно занять любой

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/comedians") {
      try {
        const data = await fs.readFile("comedians.json", "utf-8");
        res.writeHead(200, {
          "Content-Type": "text/json; charset=utf-8", //убираем абракадабру
          "Access-Control-Allow-Origin": "*", //разрешаем всем адресам сайтов делать запросы
        });
        res.end(data); //текст ответа
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end(`Ошибка сервера: ${error}`);
      }
    } else {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end("Страница не найдена");
    }
  })
  .listen(PORT);

console.log("Сервер запущен на http://localhost:${PORT}");
