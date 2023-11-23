import fs from "node:fs/promises"; 

export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (error) {
      console.log("error: ", error);
      await fs.writeFile(path, JSON.stringify([]));
      console.log(`Файл $(path) создан!`);
      return true;
    }
  }

  try {
    await fs.access(path);
  } catch (error) {
    console.log("error: ", error);
    console.error(`Файл $(path) не найден!`);
    return false;
  }

  return true;
};
